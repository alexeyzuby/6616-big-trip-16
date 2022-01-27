import AbstractView from './abstract-view';
import {NavigationItem} from '../utils/const';
import {firstLetterToUpperCase} from '../utils/common';

const NAVIGATION_ACTIVE_CLASS = 'trip-tabs__btn--active';

const createNavigationItemTemplate = (navigationItem) => (
  `<a class="trip-tabs__btn ${navigationItem === 'table' ? NAVIGATION_ACTIVE_CLASS : ''}" href="#" data-navigation-name="${navigationItem}">${firstLetterToUpperCase(navigationItem)}</a>`
);

const createNavigationTemplate = () => {
  const navigationItemsTemplate = Object.values(NavigationItem).map((navigationItem) => createNavigationItemTemplate(navigationItem)).join('');

  return (
    `<nav class="trip-controls__trip-tabs trip-tabs">
      ${navigationItemsTemplate}
     </nav>`
  );
};

export default class NavigationView extends AbstractView {
  get template() {
    return createNavigationTemplate();
  }

  setNavigationClickHandler = (callback) => {
    this._callback.navigationClick = callback;
    this.element.addEventListener('click', this.#navigationClickHandler);
  };

  setNavigationItem = (navigationName) => {
    const navigationItems = this.element.querySelectorAll('.trip-tabs__btn');

    navigationItems.forEach((item) => {
      item.classList[item.dataset.navigationName === navigationName ? 'add' : 'remove'](NAVIGATION_ACTIVE_CLASS);
    });
  };

  #navigationClickHandler = (evt) => {
    evt.preventDefault();

    const target = evt.target.closest('.trip-tabs__btn');

    if (!target || target.classList.contains(NAVIGATION_ACTIVE_CLASS)) {
      return;
    }
    const targetName = target.dataset.navigationName;

    this.setNavigationItem(targetName);
    this._callback.navigationClick(targetName);
  };
}

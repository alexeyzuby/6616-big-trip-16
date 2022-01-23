import AbstractView from './abstract-view';
import {firstLetterToUpperCase} from '../utils/common';
import {SortType} from '../utils/const';

const DISABLED_SORT_TYPES = ['event', 'offer'];

const createSortItemTemplate = (sortType, currentSortType) => (
  `<div class="trip-sort__item trip-sort__item--${sortType}">
       <input id="sort-${sortType}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" data-sort-type="${sortType}" ${sortType === currentSortType ? 'checked' : ''} ${DISABLED_SORT_TYPES.includes(sortType) ? 'disabled' : ''}>
       <label class="trip-sort__btn" for="sort-${sortType}">${firstLetterToUpperCase(sortType)}</label>
     </div>`
);

const createSortTemplate = (currentSortType) => {
  const sortItemsTemplate = Object.values(SortType).map((sort) => createSortItemTemplate(sort, currentSortType)).join(' ');

  return (
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
        ${sortItemsTemplate}
     </form>`
  );
};

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    const currentInput = evt.target.parentNode.querySelector('.trip-sort__input');

    if (evt.target.tagName !== 'LABEL' || !currentInput.hasAttribute('data-sort-type') || currentInput.disabled) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(currentInput.dataset.sortType);
  };
}

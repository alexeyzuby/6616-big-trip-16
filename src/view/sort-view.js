import AbstractView from './abstract-view';
import {SortType} from '../utils/const';

const createSortItemTemplate = (sort, currentSortType) => {
  const {type, name, isDisabled} = sort;

  return (
    `<div class="trip-sort__item trip-sort__item--${type}">
       <input id="sort-${type}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${type}" data-sort-type="${type}" ${type === currentSortType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
       <label class="trip-sort__btn" for="sort-${type}">${name}</label>
     </div>`
  );
};

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

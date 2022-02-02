import AbstractView from './abstract-view';
import {SortType} from '../utils/const';
import {convertFirstLetterToUpperCase} from '../utils/common';

const createSortItemTemplate = (sortType, currentSortType, disabledSortTypes) => (
  `<div class="trip-sort__item trip-sort__item--${sortType}">
       <input id="sort-${sortType}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" data-sort-type="${sortType}" ${sortType === currentSortType ? 'checked' : ''} ${disabledSortTypes.includes(sortType) ? 'disabled' : ''}>
       <label class="trip-sort__btn" for="sort-${sortType}">${convertFirstLetterToUpperCase(sortType)}</label>
     </div>`
);

const createSortTemplate = (currentSortType, disabledSortTypes) => {
  const sortItemsTemplate = Object.values(SortType).map((sortType) => createSortItemTemplate(sortType, currentSortType, disabledSortTypes)).join('');

  return (
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
        ${sortItemsTemplate}
     </form>`
  );
};

export default class SortView extends AbstractView {
  #currentSortType = null;
  #disabledSortTypes = ['event', 'offer'];

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType, this.#disabledSortTypes);
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

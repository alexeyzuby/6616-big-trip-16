import {createElement} from '../render.js';

const createNavigationTemplate = () => (
  `<nav class="trip-controls__trip-tabs trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`
);

export default class NavigationView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNavigationTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

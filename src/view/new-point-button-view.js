import AbstractView from './abstract-view';

const createNewPointButtonTemplate = () => (
  '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>'
);

export default class NewPointButtonView extends AbstractView {
  get template() {
    return createNewPointButtonTemplate();
  }

  disableButton = () => {
    this.element.disabled = true;
  };

  enableButton = () => {
    this.element.disabled = false;
  };

  setNewButtonClickHandler = (callback) => {
    this._callback.newButtonClick = callback;
    this.element.addEventListener('click', this.#newButtonClickHandler);
  };

  #newButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.disableButton();
    this._callback.newButtonClick();
  };
}

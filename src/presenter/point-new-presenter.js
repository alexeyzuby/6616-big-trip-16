import PointFormView from '../view/point-form-view';
import {render, remove, RenderPosition} from '../utils/render';
import {UserAction, UpdateType, ESCAPE_KEY} from '../utils/const';

export default class PointNewPresenter {
  #pointsListContainer = null;
  #newPointButtonComponent = null;
  #changeData = null;
  #onDeleteClick = null;
  #pointFormComponent = null;

  constructor(pointsListContainer, newPointButtonComponent, changeData, onDeleteClick) {
    this.#pointsListContainer = pointsListContainer;
    this.#newPointButtonComponent = newPointButtonComponent;
    this.#changeData = changeData;
    this.#onDeleteClick = onDeleteClick;
  }

  init = (offers, destinations) => {
    if (this.#pointFormComponent !== null) {
      return;
    }

    this.#pointFormComponent = new PointFormView(offers, destinations);
    this.#pointFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointsListContainer, this.#pointFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointFormComponent === null) {
      return;
    }

    remove(this.#pointFormComponent);
    this.#pointFormComponent = null;
    this.#newPointButtonComponent.enableButton();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#pointFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointFormComponent.shake(resetFormState);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
    this.#onDeleteClick();
  };
}

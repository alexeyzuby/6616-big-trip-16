import PointFormView from '../view/point-form-view';
import {render, remove, RenderPosition} from '../utils/render';
import {UserAction, UpdateType} from '../utils/const';
import {nanoid} from 'nanoid';

export default class PointNewPresenter {
  #pointsListContainer = null;
  #changeData = null;
  #onDeleteClick = null;
  #pointFormComponent = null;

  constructor(pointsListContainer, changeData, onDeleteClick) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#onDeleteClick = onDeleteClick;
  }

  init = () => {
    if (this.#pointFormComponent !== null) {
      return;
    }

    this.#pointFormComponent = new PointFormView();
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

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point, id: nanoid()},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
    this.#onDeleteClick();
  };
}

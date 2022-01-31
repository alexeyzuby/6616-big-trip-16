import PointView from '../view/point-view';
import PointFormView from '../view/point-form-view';
import {render, replace, remove, RenderPosition} from '../utils/render';
import {UserAction, UpdateType, ESCAPE_KEY} from '../utils/const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointFormComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(pointsListContainer, changeData, changeMode) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offers, destinations) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointFormComponent = this.#pointComponent;

    this.#pointComponent = new PointView(this.#point);
    this.#pointFormComponent = new PointFormView(offers, destinations, this.#point);

    this.#pointComponent.setFormOpenHandler(this.#handleFormOpen);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointFormComponent.setFormCloseHandler(this.#handleFormClose);
    this.#pointFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevPointFormComponent === null) {
      render(this.#pointsListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointFormComponent, prevPointFormComponent);
    }

    remove(prevPointComponent);
    remove(prevPointFormComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointFormComponent.reset(this.#point);
      this.#replaceToPoint();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointFormComponent);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this.#pointFormComponent.reset(this.#point);
      this.#replaceToPoint();
    }
  };

  #replaceToForm = () => {
    replace(this.#pointFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceToPoint = () => {
    replace(this.#pointComponent, this.#pointFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #handleFormOpen = () => {
    this.#replaceToForm();
  };

  #handleFormClose = () => {
    this.#pointFormComponent.reset(this.#point);
    this.#replaceToPoint();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #handleFormSubmit = (update) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
    this.#replaceToPoint();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}

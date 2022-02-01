import {render, RenderPosition, remove} from '../utils/render';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #pointsModel = null;

  constructor(tripInfoContainer, pointsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    const pointsLength = this.#pointsModel.points.length;

    this.#pointsModel.addObserver(this.#handleModelEvent);

    if (pointsLength === 0) {
      remove(this.#tripInfoComponent);
      return;
    }

    if (this.#tripInfoComponent !== null) {
      remove(this.#tripInfoComponent);
    }

    this.#tripInfoComponent = new TripInfoView(this.#pointsModel.points);

    render(this.#tripInfoContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}

import PointPresenter from './point-presenter';
import TripInfoView from '../view/trip-info-view';
import NavigationView from '../view/navigation-view';
import FiltersView from '../view/filters-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import NoPointsView from '../view/no-points-view';
import {render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common.js';

export default class TripPresenter {
  #tripMainContainer = null;
  #navigationContainer = null;
  #filtersContainer = null;
  #pointsListContainer = null;

  #tripInfoComponent = new TripInfoView();
  #navigationComponent = new NavigationView();
  #filtersComponent = new FiltersView();
  #sortComponent = new SortView();
  #pointsListComponent = new PointsListView();
  #noPointsComponent = new NoPointsView();

  #points = [];
  #pointPresenter = new Map();

  constructor(tripMainContainer, pointsListContainer, navigationContainer, filtersContainer) {
    this.#tripMainContainer = tripMainContainer;
    this.#pointsListContainer = pointsListContainer;
    this.#navigationContainer = navigationContainer;
    this.#filtersContainer = filtersContainer;
  }

  init = (points) => {
    this.#points = [...points];
    this.#renderControls();
    (this.#points.length ? this.#renderPointsList : this.#renderNoPoints)();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #renderControls = () => {
    render(this.#navigationContainer, this.#navigationComponent, RenderPosition.BEFOREEND);
    render(this.#filtersContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPointsList = () => {
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#pointsListContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    render(this.#pointsListContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderNoPoints = () => {
    render(this.#pointsListContainer, this.#noPointsComponent, RenderPosition.BEFOREEND);
  };
}

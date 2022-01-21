import PointPresenter from './point-presenter';
import TripInfoView from '../view/trip-info-view';
import NavigationView from '../view/navigation-view';
import FiltersView from '../view/filters-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import NoPointsView from '../view/no-points-view';
import {render, RenderPosition} from '../utils/render';
import {sortByTime, sortByPrice} from '../utils/point';
import {updateItem} from '../utils/common.js';
import {SortType} from '../utils/const';

export default class TripPresenter {
  #tripMainContainer = null;
  #navigationContainer = null;
  #filtersContainer = null;
  #pointsListContainer = null;
  #pointsModel = null;

  #tripInfoComponent = new TripInfoView();
  #navigationComponent = new NavigationView();
  #filtersComponent = new FiltersView();
  #sortComponent = new SortView();
  #pointsListComponent = new PointsListView();
  #noPointsComponent = new NoPointsView();

  #points = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedPoints = [];

  constructor(tripMainContainer, pointsListContainer, navigationContainer, filtersContainer, pointsModel) {
    this.#tripMainContainer = tripMainContainer;
    this.#pointsListContainer = pointsListContainer;
    this.#navigationContainer = navigationContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
  }

  get points() {
    return this.#pointsModel.points;
  }

  init = (points) => {
    this.#points = [...points];
    this.#sourcedPoints = [...points];
    this.#renderControls();
    (this.#points.length ? this.#renderPointsList : this.#renderNoPoints)();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPoints();
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  };

  #renderControls = () => {
    render(this.#navigationContainer, this.#navigationComponent, RenderPosition.BEFOREEND);
    render(this.#filtersContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    render(this.#pointsListContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderNoPoints = () => {
    render(this.#pointsListContainer, this.#noPointsComponent, RenderPosition.BEFOREEND);
  };

  #clearPoints = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointsList = () => {
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    this.#renderSort();
    render(this.#pointsListContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);

    this.#renderPoints();
  };
}

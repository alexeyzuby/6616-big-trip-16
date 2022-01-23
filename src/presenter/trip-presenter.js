import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';
import TripInfoView from '../view/trip-info-view';
import NavigationView from '../view/navigation-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import NoPointsView from '../view/no-points-view';
import {render, remove, RenderPosition} from '../utils/render';
import {sortByTime, sortByPrice, sortByDate} from '../utils/sort';
import {SortType, FilterType, UserAction, UpdateType} from '../utils/const';
import {filters} from '../utils/filters';

export default class TripPresenter {
  #tripMainContainer = null;
  #navigationContainer = null;
  #pointsListContainer = null;
  #noPointsComponent = null;
  #sortComponent = null;
  #pointsModel = null;
  #filtersModel = null;

  #tripInfoComponent = new TripInfoView();
  #navigationComponent = new NavigationView();
  #pointsListComponent = new PointsListView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(tripMainContainer, navigationContainer, pointsListContainer, pointsModel, filtersModel) {
    this.#tripMainContainer = tripMainContainer;
    this.#navigationContainer = navigationContainer;
    this.#pointsListContainer = pointsListContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointsListComponent, this.#handleViewAction, this.#handleNewPointDeleteClick);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filters[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints.sort(sortByDate);
  }

  init = () => {
    render(this.#navigationContainer, this.#navigationComponent, RenderPosition.BEFOREEND);

    this.#renderTrip();
  };

  createPoint = () => {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    this.#renderPointsList();
    this.#pointNewPresenter.init();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #handleNewPointDeleteClick = () => {
    const points = this.points;
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#clearTrip();
      this.#renderTrip(points);
    }
  };

  #renderTripInfo = () => {
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#pointsListContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    render(this.#pointsListContainer, this.#noPointsComponent, RenderPosition.BEFOREEND);
  };

  #renderPointsList = () => {
    render(this.#pointsListContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    remove(this.#sortComponent);
    remove(this.#pointsListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderTrip = () => {
    const points = this.points;
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints();
  };
}

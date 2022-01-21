import PointPresenter from './point-presenter';
import TripInfoView from '../view/trip-info-view';
import NavigationView from '../view/navigation-view';
import FiltersView from '../view/filters-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import NoPointsView from '../view/no-points-view';
import {render, remove, RenderPosition} from '../utils/render';
import {sortByTime, sortByPrice, sortByDate} from '../utils/point';
import {SortType, UserAction, UpdateType} from '../utils/const';

export default class TripPresenter {
  #tripMainContainer = null;
  #navigationContainer = null;
  #filtersContainer = null;
  #pointsListContainer = null;
  #noPointsComponent = null;
  #sortComponent = null;
  #pointsModel = null;

  #tripInfoComponent = new TripInfoView();
  #navigationComponent = new NavigationView();
  #filtersComponent = new FiltersView();
  #pointsListComponent = new PointsListView();

  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(tripMainContainer, navigationContainer, filtersContainer, pointsListContainer, pointsModel) {
    this.#tripMainContainer = tripMainContainer;
    this.#navigationContainer = navigationContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsListContainer = pointsListContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }

    return [...this.#pointsModel.points].sort(sortByDate);
  }

  init = () => {
    render(this.#navigationContainer, this.#navigationComponent, RenderPosition.BEFOREEND);
    render(this.#filtersContainer, this.#filtersComponent, RenderPosition.BEFOREEND);

    this.#renderTrip();
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

  #renderTripInfo = () => {
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

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
    this.#noPointsComponent = new NoPointsView();
    render(this.#pointsListContainer, this.#noPointsComponent, RenderPosition.BEFOREEND);
  };

  #renderPointsList = () => {
    render(this.#pointsListContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    remove(this.#sortComponent);
    remove(this.#pointsListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
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

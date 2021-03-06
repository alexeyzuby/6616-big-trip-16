import PointPresenter, {State as PointPresenterViewState} from './point-presenter';
import PointNewPresenter from './point-new-presenter';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import NoPointsView from '../view/no-points-view';
import LoadingView from '../view/loading-view';
import {render, remove, RenderPosition} from '../utils/render';
import {SortType, FilterType, UserAction, UpdateType} from '../utils/const';
import {sortByTime, sortByPrice, sortByDate} from '../utils/sort';
import {Filters} from '../utils/filters';

export default class TripPresenter {
  #pointsListContainer = null;
  #noPointsComponent = null;
  #sortComponent = null;
  #pointsModel = null;
  #filtersModel = null;

  #pointsListComponent = new PointsListView();
  #loadingComponent = new LoadingView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(pointsListContainer, newPointButtonComponent, pointsModel, filtersModel) {
    this.#pointsListContainer = pointsListContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointsListComponent, newPointButtonComponent, this.#handleViewAction, this.#handleNewPointDeleteClick);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = Filters[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints.sort(sortByDate);
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init = () => {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#renderTrip();
  };

  destroy = () => {
    this.#clearTrip({resetSortType: true});

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filtersModel.removeObserver(this.#handleModelEvent);
  };

  createPoint = () => {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    this.#renderPointsList();
    this.#pointNewPresenter.init(this.offers, this.destinations);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#pointsListContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.offers, this.destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#pointsListContainer, this.#loadingComponent, RenderPosition.BEFOREEND);
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
    remove(this.#loadingComponent);
    remove(this.#pointsListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderTrip = () => {
    const points = this.points;
    const pointsCount = points.length;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints();
  };
}

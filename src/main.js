import TripInfoView from './view/trip-info-view';
import NavigationView from './view/navigation-view';
import FiltersView from './view/filters-view';
import SortView from './view/sort-view';
import PointsListView from './view/points-list-view';
import PointFormView from './view/point-form-view';
import PointView from './view/point-view';
import NoPointsView from './view/no-points-view';
import {render, replace, RenderPosition} from './utils/render';
import {generatePoint} from './mock/point';

const ESCAPE_KEY = 'Escape';
const POINTS_COUNT = 10;

const header = document.querySelector('.page-header');
const pageMain = document.querySelector('.page-main');
const tripMain = header.querySelector('.trip-main');
const tripNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = pageMain.querySelector('.trip-events');

render(tripNavigation, new NavigationView(), RenderPosition.BEFOREEND);
render(tripFilters, new FiltersView(), RenderPosition.BEFOREEND);

const points = [...Array(POINTS_COUNT)].map((point, index) => generatePoint(index + 1));
const pointsListComponent = new PointsListView();

const renderPoint = (pointsListElement, task) => {
  const pointComponent = new PointView(task);
  const pointFormComponent = new PointFormView(task);

  const replacePointToForm = () => {
    replace(pointFormComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointFormComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setRollupClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointFormComponent.setFormSubmitHandler((evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointFormComponent.setRollupClickHandler(() => {
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(pointsListElement, pointComponent, RenderPosition.BEFOREEND);
};

if (points.length) {
  render(tripMain, new TripInfoView(), RenderPosition.AFTERBEGIN);
  render(tripEvents, new SortView(), RenderPosition.BEFOREEND);
  render(tripEvents, pointsListComponent, RenderPosition.BEFOREEND);

  for (let i = 0; i < POINTS_COUNT; i++) {
    renderPoint(pointsListComponent, points[i]);
  }
} else {
  render(tripEvents, new NoPointsView(), RenderPosition.BEFOREEND);
}

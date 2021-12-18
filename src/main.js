import TripInfoView from './view/trip-info';
import NavigationView from './view/navigation';
import FiltersView from './view/filters';
import SortView from './view/sort';
import PointsListView from './view/points-list';
import PointFormView from './view/point-form';
import PointView from './view/point';
import NoPointsView from './view/no-points';
import {render, RenderPosition} from './render';
import {generatePoint} from './mock/point';

const POINTS_COUNT = 10;

const header = document.querySelector('.page-header');
const pageMain = document.querySelector('.page-main');
const tripMain = header.querySelector('.trip-main');
const tripNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = pageMain.querySelector('.trip-events');

render(tripNavigation, new NavigationView().element, RenderPosition.BEFOREEND);
render(tripFilters, new FiltersView().element, RenderPosition.BEFOREEND);

const points = [...Array(POINTS_COUNT)].map((point, index) => generatePoint(index + 1));
const pointsListComponent = new PointsListView();

const renderPoint = (pointsListElement, task) => {
  const pointComponent = new PointView(task);
  const pointFormComponent = new PointFormView(task);

  const replacePointToForm = () => {
    pointsListElement.replaceChild(pointFormComponent.element, pointComponent.element);
  };

  const replaceFormToPoint = () => {
    pointsListElement.replaceChild(pointComponent.element, pointFormComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointFormComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(pointsListElement, pointComponent.element, RenderPosition.BEFOREEND);
};

if (points.length) {
  render(tripMain, new TripInfoView().element, RenderPosition.AFTERBEGIN);
  render(tripEvents, new SortView().element, RenderPosition.BEFOREEND);
  render(tripEvents, pointsListComponent.element, RenderPosition.BEFOREEND);

  for (let i = 0; i < POINTS_COUNT; i++) {
    renderPoint(pointsListComponent.element, points[i]);
  }
} else {
  render(tripEvents, new NoPointsView().element, RenderPosition.BEFOREEND);
}

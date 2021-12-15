import TripInfoView from './view/trip-info';
import NavigationView from './view/navigation';
import FiltersView from './view/filters';
import SortView from './view/sort';
import PointsListView from './view/points-list';
import PointFormView from './view/point-form';
import PointView from './view/point';
import {render, RenderPosition} from './render';
import {generatePoint} from './mock/point';

const POINTS_COUNT = 15;

const header = document.querySelector('.page-header');
const pageMain = document.querySelector('.page-main');
const tripMain = header.querySelector('.trip-main');
const tripNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = pageMain.querySelector('.trip-events');

render(tripMain, new TripInfoView().element, RenderPosition.AFTERBEGIN);
render(tripNavigation, new NavigationView().element, RenderPosition.BEFOREEND);
render(tripFilters, new FiltersView().element, RenderPosition.BEFOREEND);
render(tripEvents, new SortView().element, RenderPosition.BEFOREEND);

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

  pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
  });

  pointFormComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  });

  render(pointsListElement, pointComponent.element, RenderPosition.BEFOREEND);
};

render(tripEvents, pointsListComponent.element, RenderPosition.BEFOREEND);

for (let i = 0; i < POINTS_COUNT; i++) {
  renderPoint(pointsListComponent.element, points[i]);
}

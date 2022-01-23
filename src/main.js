import {generatePoint} from './mock/point';
import FiltersPresenter from './presenter/filters-presenter';
import TripPresenter from './presenter/trip-presenter';
import FiltersModel from './model/filters-model.js';
import PointsModel from './model/points-model';

const POINTS_COUNT = 3;

const points = [...Array(POINTS_COUNT)].map(() => generatePoint());

const filtersModel = new FiltersModel();
const pointsModel = new PointsModel();

pointsModel.points = points;

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripAddButton = tripMain.querySelector('.trip-main__event-add-btn');

const filtersPresenter = new FiltersPresenter(tripFilters, filtersModel);
const tripPresenter = new TripPresenter(tripMain, tripNavigation, tripEvents, pointsModel, filtersModel);

filtersPresenter.init();
tripPresenter.init();

tripAddButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

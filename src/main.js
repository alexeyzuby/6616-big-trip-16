import TripPresenter from './presenter/trip-presenter';
import {generatePoint} from './mock/point';

const POINTS_COUNT = 10;

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');

const tripPresenter = new TripPresenter(tripMain, tripEvents, tripNavigation, tripFilters);

const points = [...Array(POINTS_COUNT)].map((point, index) => generatePoint(index + 1));

tripPresenter.init(points);

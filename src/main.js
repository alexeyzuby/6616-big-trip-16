import {renderTemplate, RenderPosition} from './render.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createTripInfoTemplate} from './view/trip-info';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list';
import {createPointsItemTemplate} from './view/points-item';
import {createPointTemplate} from './view/point';
import {createPointFormTemplate} from './view/point-form';

import {generatePoint} from './mock/point';

const POINTS_COUNT = 15;

const points = [...Array(POINTS_COUNT)].map((point, index) => generatePoint(index + 1));

const header = document.querySelector('.page-header');
const pageMain = document.querySelector('.page-main');
const tripMain = header.querySelector('.trip-main');
const tripNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = pageMain.querySelector('.trip-events');

renderTemplate(tripMain, RenderPosition.AFTERBEGIN, createTripInfoTemplate());
renderTemplate(tripNavigation, RenderPosition.BEFOREEND, createNavigationTemplate());
renderTemplate(tripFilters, RenderPosition.BEFOREEND, createFiltersTemplate());
renderTemplate(tripEvents, RenderPosition.BEFOREEND, createSortTemplate());
renderTemplate(tripEvents, RenderPosition.BEFOREEND, createPointsListTemplate());

const tripEventsList = tripEvents.querySelector('.trip-events__list');

renderTemplate(tripEventsList, RenderPosition.BEFOREEND, createPointsItemTemplate(createPointFormTemplate(points[0])));

for(let i = 0; i < POINTS_COUNT; i++) {
  renderTemplate(tripEventsList, RenderPosition.BEFOREEND, createPointsItemTemplate(createPointTemplate(points[i])));
}

import {renderTemplate, RenderPosition} from './render.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createTripInfoTemplate} from './view/trip-info';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createEventsListTemplate} from './view/events-list';
import {createEventsItemTemplate} from './view/events-item';
import {createEventTemplate} from './view/event';
import {createEventFormTemplate} from './view/event-form';

const EVENTS_COUNT = 3;

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
renderTemplate(tripEvents, RenderPosition.BEFOREEND, createEventsListTemplate());

const tripEventsList = tripEvents.querySelector('.trip-events__list');

renderTemplate(tripEventsList, RenderPosition.BEFOREEND, createEventsItemTemplate(createEventFormTemplate()));

for(let i = 0; i < EVENTS_COUNT; i++) {
  renderTemplate(tripEventsList, RenderPosition.BEFOREEND, createEventsItemTemplate(createEventTemplate()));
}

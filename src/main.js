import {generatePoint} from './mock/point';
import NavigationView from './view/navigation-view';
import StatsView from './view/stats-view';
import FiltersPresenter from './presenter/filters-presenter';
import TripPresenter from './presenter/trip-presenter';
import FiltersModel from './model/filters-model';
import PointsModel from './model/points-model';
import {NavigationItem, HeaderButton, NAVIGATION_ACTIVE_CLASS} from './utils/const';
import {render, remove, RenderPosition} from './utils/render';
import {switchNavigationActive} from './utils/navigation';

const POINTS_COUNT = 5;

const points = [...Array(POINTS_COUNT)].map(() => generatePoint());

const filtersModel = new FiltersModel();
const pointsModel = new PointsModel();

pointsModel.points = points;

const pageMain = document.querySelector('.page-main');
const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const pageContainer = pageMain.querySelector('.page-body__container');
const tripNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const tripAddButton = tripMain.querySelector('.trip-main__event-add-btn');
const navigationComponent = new NavigationView();

render(tripNavigation, navigationComponent, RenderPosition.BEFOREEND);

const filtersPresenter = new FiltersPresenter(tripFilters, filtersModel);
const tripPresenter = new TripPresenter(tripMain, tripEvents, pointsModel, filtersModel);

let statsComponent = null;

const handleNavigationClick = (navigationItem) => {
  const navigationItems = tripMain.querySelectorAll('.trip-tabs__btn');

  switch (navigationItem) {
    case HeaderButton.ADD_EVENT:
      remove(statsComponent);
      filtersPresenter.destroy();
      filtersPresenter.init();
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.createPoint();
      switchNavigationActive(navigationItems, NavigationItem.TABLE, NAVIGATION_ACTIVE_CLASS);
      break;
    case NavigationItem.TABLE:
      remove(statsComponent);
      filtersPresenter.init();
      tripPresenter.init();
      break;
    case NavigationItem.STATS:
      filtersPresenter.destroy();
      tripPresenter.destroy();
      statsComponent = new StatsView(pointsModel.points);
      render(pageContainer, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

navigationComponent.setNavigationClickHandler(handleNavigationClick);

filtersPresenter.init();
tripPresenter.init();

tripAddButton.addEventListener('click', (evt) => {
  evt.preventDefault();

  handleNavigationClick(HeaderButton.ADD_EVENT);
});

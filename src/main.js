import ApiService from './api-service';
import NewPointButtonView from './view/new-point-button-view';
import NavigationView from './view/navigation-view';
import StatsView from './view/stats-view';
import TripInfoPresenter from './presenter/trip-info-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import TripPresenter from './presenter/trip-presenter';
import FiltersModel from './model/filters-model';
import PointsModel from './model/points-model';
import {NavigationItem} from './utils/const';
import {render, remove, RenderPosition} from './utils/render';

const AUTHORIZATION = 'Basic fwcw34ewfjk22';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const filtersModel = new FiltersModel();
const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));

const pageMain = document.querySelector('.page-main');
const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const pageContainer = pageMain.querySelector('.page-body__container');
const tripNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');

const newPointButtonComponent = new NewPointButtonView();
const navigationComponent = new NavigationView();

render(tripMain, newPointButtonComponent, RenderPosition.BEFOREEND);
render(tripNavigation, navigationComponent, RenderPosition.BEFOREEND);

const tripInfoPresenter = new TripInfoPresenter(tripMain, pointsModel);
const filtersPresenter = new FiltersPresenter(tripFilters, pointsModel, filtersModel);
const tripPresenter = new TripPresenter(tripEvents, newPointButtonComponent, pointsModel, filtersModel);

let statsComponent = null;

const handleNavigationClick = (navigationItem) => {
  switch (navigationItem) {
    case NavigationItem.TABLE:
      remove(statsComponent);
      filtersPresenter.init();
      tripPresenter.init();
      newPointButtonComponent.enableButton();
      break;
    case NavigationItem.STATS:
      filtersPresenter.destroy();
      tripPresenter.destroy();
      statsComponent = new StatsView(pointsModel.points);
      render(pageContainer, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const handleNewButtonClick = () => {
  remove(statsComponent);
  filtersPresenter.destroy();
  filtersPresenter.init();
  tripPresenter.destroy();
  tripPresenter.init();
  tripPresenter.createPoint();
  navigationComponent.setNavigationItem(NavigationItem.TABLE);
};

navigationComponent.setNavigationClickHandler(handleNavigationClick);

tripInfoPresenter.init();
tripPresenter.init();

pointsModel.init().finally(() => {
  filtersPresenter.init();
  newPointButtonComponent.setNewButtonClickHandler(handleNewButtonClick);
});

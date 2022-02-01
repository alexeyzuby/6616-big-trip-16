import AbstractView from './abstract-view';
import {sortByDate} from '../utils/sort';
import dayjs from 'dayjs';

const getTripDestinations = (destinations, startPoint, endPoint) => {
  if (destinations.length > 3) {
    return (
      `${startPoint.destination.name} ... ${endPoint.destination.name}`
    );
  }

  return `${destinations.join(' &mdash; ')}`;
};

const getTripDate = (date) => dayjs(date).format('MMM DD');
const getTripCost = (points) => points.reduce((prev, next) => prev + next.price + next.offers.reduce((sum, offer) => sum + offer.price, 0), 0);

const createTripInfoTemplate = (points) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = points.sort(sortByDate);
  const destinations = sortedPoints.map((point) => point.destination.name);
  const startPoint = sortedPoints.map((point) => point).sort((a, b) => a.dateFrom - b.dateFrom)[0];
  const endPoint = sortedPoints.map((point) => point).sort((a, b) => b.dateTo - a.dateTo)[0];

  return (
    `<section class="trip-main__trip-info trip-info">
     <div class="trip-info__main">
       <h1 class="trip-info__title">${getTripDestinations(destinations, startPoint, endPoint)}</h1>
       <p class="trip-info__dates">${getTripDate(startPoint.dateFrom)}&nbsp;&mdash;&nbsp;${getTripDate(endPoint.dateTo)}</p>
     </div>
     <p class="trip-info__cost">
       Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(points)}</span>
     </p>
  </section>`
  );
};

export default class TripInfoView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripInfoTemplate(this.#points);
  }
}

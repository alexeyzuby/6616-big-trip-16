import {getRandomInteger} from '../utils';
import {MINUTES_GAPS, POINT_TYPES, POINT_PRICES} from '../const';
import {generateDestination} from './destination';
import {generateOffer} from './offer';
import dayjs from 'dayjs';

let currentDate = dayjs();

const generateDate = () => {
  const date = dayjs(currentDate).add(getRandomInteger(MINUTES_GAPS.MIN, MINUTES_GAPS.MAX), 'minute').toDate();
  currentDate = date;

  return date;
};

export const generatePoint = (id) => {
  const type = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];

  return {
    id,
    type: type,
    isFavorite: Boolean(getRandomInteger()),
    price: getRandomInteger(POINT_PRICES.MIN, POINT_PRICES.MAX),
    dateFrom: generateDate(),
    dateTo: generateDate(),
    destination: generateDestination(id),
    pointOffers: generateOffer(type),
  };
};

import {getRandomInteger} from '../utils';
import {generateDestination} from './destination';
import {generateOffer} from './offer';
import {POINT_TYPES} from '../const';
import dayjs from 'dayjs';

const POINT_PRICE_MIN = 10;
const POINT_PRICE_MAX = 999;
const MINUTE_GAP_MIN = 10;
const MINUTE_GAP_MAX = 999;

let currentDate = dayjs();

const generateDate = () => {
  const date = dayjs(currentDate).add(getRandomInteger(MINUTE_GAP_MIN, MINUTE_GAP_MAX), 'minute').toDate();
  currentDate = date;

  return date;
};

export const generatePoint = (id) => {
  const pointType = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];

  return {
    id,
    type: pointType,
    isFavorite: Boolean(getRandomInteger()),
    price: getRandomInteger(POINT_PRICE_MIN, POINT_PRICE_MAX),
    dateFrom: generateDate(),
    dateTo: generateDate(),
    destination: generateDestination(id),
    pointOffers: generateOffer(pointType),
  };
};

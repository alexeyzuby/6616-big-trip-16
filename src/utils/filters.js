import {FilterType} from './const';

export const filters = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => Date.parse(point.dateFrom) >= Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => Date.parse(point.dateTo) < Date.now()),
};

export const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

export const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
export const DESTINATION_NAMES = ['Moscow', 'Amsterdam', 'Helsinki', 'Paris', 'Tokyo', 'Madrid', 'Rome', 'Barcelona', 'Berlin', 'New York'];
export const ESCAPE_KEY = 'Escape';

export const SortType = {
  DAY: {
    type: 'day',
    name: 'Day',
    isDisabled: false,
  },
  EVENT: {
    type: 'event',
    name: 'Event',
    isDisabled: true,
  },
  TIME: {
    type: 'time',
    name: 'Time',
    isDisabled: false,
  },
  PRICE: {
    type: 'price',
    name: 'Price',
    isDisabled: false,
  },
  OFFER: {
    type: 'offer',
    name: 'Offer',
    isDisabled: true,
  },
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

import dayjs from 'dayjs';

export const sortByTime = (pointA, pointB) => {
  const durationPointA = dayjs(pointA.dateTo).diff(pointA.dateFrom, 'minute');
  const durationPointB = dayjs(pointB.dateTo).diff(pointB.dateFrom, 'minute');

  return durationPointB - durationPointA;
};

export const sortByPrice = (pointA, pointB) => pointB.price - pointA.price;

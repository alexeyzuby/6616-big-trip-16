import dayjs from 'dayjs';

const filterByType = (points, type) => points.filter((point) => point.type === type);

export const pointsCostByType = (points, type) => {
  const filteredPoints = filterByType(points, type);

  return {
    moneySum: filteredPoints.reduce((moneySum, point) => moneySum + point.price, 0),
    pointType: type,
  };
};

export const pointsQuantityByType = (points, type) => {
  const filteredPoints = filterByType(points, type);

  return {
    typeQuantity: filteredPoints.length,
    pointType: type,
  };
};

export const pointsDurationByType = (points, type) => {
  const filteredPoints = filterByType(points, type);

  return {
    pointDuration: filteredPoints.reduce((pointDuration, point) => pointDuration + dayjs(point.dateTo).diff(dayjs(point.dateFrom), 'minutes'), 0),
    pointType: type,
  };
};

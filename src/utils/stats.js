import {getPointDurationByMinutes} from './duration';
import dayjs from 'dayjs';

const filterByType = (points, type) => points.filter((point) => point.type === type);

export const ChartsOptions = {
  MONEY: {
    setData: (points, type) => filterByType(points, type).reduce((sum, point) => sum + point.price, 0),
    setFormatter: (val) => `€ ${val}`,
  },
  TYPE: {
    setData: (points, type) => filterByType(points, type).length,
    setFormatter: (val) => `${val}x`,
  },
  TIME: {
    setData: (points, type) => filterByType(points, type).reduce((duration, point) => duration + dayjs(point.dateTo).diff(dayjs(point.dateFrom), 'minutes'), 0),
    setFormatter: (val) => getPointDurationByMinutes(val),
  },
};

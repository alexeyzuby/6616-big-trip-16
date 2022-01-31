import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../utils/const';

export default class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;

      this.#points = points.map(this.#adaptToClient);
      this.#offers = await this.#apiService.offers;
      this.#destinations = await this.#apiService.destinations;
    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#apiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  };

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete task');
    }
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
      price: point['base_price'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  };
}

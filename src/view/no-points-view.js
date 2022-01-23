import AbstractView from './abstract-view';
import {NoPointsTextType} from '../utils/filters';

const createNoPointsTemplate = (filterType) => {
  const NoPointsTextValue = NoPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
       ${NoPointsTextValue}
     </p>`
  );
};

export default class NoPointsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoPointsTemplate(this._data);
  }
}

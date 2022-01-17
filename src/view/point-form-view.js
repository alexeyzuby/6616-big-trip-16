import SmartView from './smart-view';
import {generateOffer} from '../mock/offer';
import {generateDestination} from '../mock/destination';
import {firstLetterToUpperCase} from '../utils/common';
import {DESTINATION_NAMES, POINT_TYPES} from '../utils/const';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_TASK = {
  id: 1,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  type: 'train',
  price: '',
  destination: '',
  pointOffers: {
    type: 'train',
    offers: []
  }
};

const createTypesItemsTemplate = (id, types) => (
  `${types.map((type) => `<div class="event__type-item">
     <input id="event-type-${type}-${id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}">
     <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${id}">${firstLetterToUpperCase(type)}</label>
   </div>`).join('')}`
);

const createDestinationOptionsTemplate = (destinations) => (
  `${destinations.map((destination) => `<option value="${destination}"></option>`).join('')}`
);

const createOffersSelectorTemplate = (id, pointOffers) => (
  `${pointOffers.offers.map((offer) => `<div class="event__offer-selector">
     <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.name}-${id}" type="checkbox" name="event-offer-${offer.name}"${offer.isChecked ?
    ' checked' : ''}>
     <label class="event__offer-label" for="event-offer-${offer.name}-${id}">
       <span class="event__offer-title">${offer.title}</span>
       &plus;&euro;&nbsp;
       <span class="event__offer-price">${offer.price}</span>
     </label>
   </div>`).join('')}`
);

const createDestinationPicturesTemplate = (destination) => {
  if (destination) {
    return (
      `${destination.pictures.length ? `<div class="event__photos-container">
         <div class="event__photos-tape">
           ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
         </div>
      </div>` : ''}`
    );
  }

  return '';
};

const createOffersTemplate = (offers) => {
  if (offers) {
    return (
      `<section class="event__section event__section--offers">
         <h3 class="event__section-title event__section-title--offers">Offers</h3>
         <div class="event__available-offers">${offers}</div>
      </section>`
    );
  }

  return '';
};

const createDestinationTemplate = (destination, pictures) => {
  if (destination) {
    return (
      `<section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        ${pictures}
      </section>`
    );
  }

  return '';
};

const createPointFormTemplate = (data) => {
  const {id, type, destination, dateFrom, dateTo, price, pointOffers} = data;

  const typesItems = createTypesItemsTemplate(id, POINT_TYPES);
  const destinationsOptions = createDestinationOptionsTemplate(DESTINATION_NAMES);
  const offersSelectors = createOffersSelectorTemplate(id, pointOffers);
  const destinationPictures = createDestinationPicturesTemplate(destination);

  const startTime = dayjs(dateFrom).format('DD/MM/YYYY HH:mm');
  const endTime = dayjs(dateTo).format('DD/MM/YYYY HH:mm');

  return (
    `<li class="trip-events__item">
       <form class="event event--edit" action="#" method="post">
         <header class="event__header">
           <div class="event__type-wrapper">
             <label class="event__type event__type-btn" for="event-type-toggle-${id}">
               <span class="visually-hidden">Choose event type</span>
               <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
             </label>
             <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox">
             <div class="event__type-list">
               <fieldset class="event__type-group">
                 <legend class="visually-hidden">Event type</legend>
                 ${typesItems}
               </fieldset>
             </div>
           </div>
           <div class="event__field-group event__field-group--destination">
             <label class="event__label event__type-output" for="event-destination-${id}">${type}</label>
             <input id="event-destination-${id}" class="event__input event__input--destination" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-${id}">
             <datalist id="destination-list-${id}">
               ${destinationsOptions}
             </datalist>
           </div>
           <div class="event__field-group  event__field-group--time">
             <label class="visually-hidden" for="event-start-time-${id}">From</label>
             <input class="event__input event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startTime}" data-date-type="dateFrom">
             &mdash;
             <label class="visually-hidden" for="event-end-time-${id}">To</label>
             <input class="event__input event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endTime}" data-date-type="dateTo">
           </div>
           <div class="event__field-group event__field-group--price">
             <label class="event__label" for="event-price-${id}">
               <span class="visually-hidden">Price</span>
               &euro;
             </label>
             <input class="event__input event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
           </div>
           <button class="event__save-btn btn btn--blue" type="submit">Save</button>
           <button class="event__reset-btn" type="reset">Delete</button>
           <button class="event__rollup-btn" type="button">
             <span class="visually-hidden">Open event</span>
           </button>
         </header>
         <section class="event__details">
           ${createOffersTemplate(offersSelectors)}
           ${createDestinationTemplate(destination, destinationPictures)}
         </section>
       </form>
     </li>`
  );
};

export default class PointFormView extends SmartView {
  #datepicker = new Map;

  constructor(point = BLANK_TASK) {
    super();
    this._data = PointFormView.parsePointToData(point);

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createPointFormTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker.size) {
      this.#datepicker.forEach((datepicker) => datepicker.destroy());
      this.#datepicker.clear();
    }
  };

  reset = (point) => {
    this.updateData(
      PointFormView.parsePointToData(point),
    );
  };

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepicker();
    this.setFormCloseHandler(this._callback.formClose);
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  setFormCloseHandler = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationNameChangeHandler);
  };

  #setDatepicker = () => {
    const dateFields = this.element.querySelectorAll('.event__input--time');

    dateFields.forEach((input) => {
      const dateType = input.dataset.dateType;

      this.#datepicker.set(dateType, flatpickr(input, {
        enableTime: true,
        time_24hr: true, // eslint-disable-line camelcase
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._data[dateType],
        minDate: dateType === 'dateTo' ? this._data['dateFrom'] : null,
        onChange: this.#dateChangeHandler
      }));
    });
  };

  #dateChangeHandler = ([userDate], dateStr, instance) => {
    this.updateData({
      [instance.element.dataset.dateType]: userDate,
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedType = evt.target.value;

    if (this._data.type === selectedType) {
      return;
    }

    this.updateData({
      type: selectedType,
      pointOffers: generateOffer(selectedType),
    });
  };

  #destinationNameChangeHandler = (evt) => {
    this.updateData({
      destination: generateDestination(evt.target.value),
    });
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClose();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointFormView.parseDataToPoint(this._data));
  };

  static parsePointToData = (point) => ({...point});
  static parseDataToPoint = (data) => ({...data});
}

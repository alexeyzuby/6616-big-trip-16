import SmartView from './smart-view';
import {POINT_TYPES} from '../utils/const';
import {firstLetterToUpperCase} from '../utils/common';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  type: POINT_TYPES[0],
  price: 0,
  destination: '',
  offers: [],
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

const createOffersSelectorTemplate = (type, pointOffers, offersList) => {
  const currentOffers = offersList.find((offer) => offer.type === type);
  const isChecked = (id) => pointOffers.some((pointOffer) => pointOffer.id === id);

  return (
    `${currentOffers.offers.map(({id, title, price}) => `<div class="event__offer-selector">
     <input class="event__offer-checkbox visually-hidden" id="event-offer-${type}-${id}" type="checkbox" name="event-offer-${type}-${id}" data-offer-id="${id}" ${isChecked(id) ? 'checked' : ''}>
     <label class="event__offer-label" for="event-offer-${type}-${id}">
       <span class="event__offer-title">${title}</span>
       &plus;&euro;&nbsp;
       <span class="event__offer-price">${price}</span>
     </label>
   </div>`).join('')}`
  );
};

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

const createPointFormTemplate = (data, offersList, destinationsList, isNew) => {
  const {id, type, destination, dateFrom, dateTo, price, offers} = data;

  const typesItems = createTypesItemsTemplate(id, POINT_TYPES);
  const destinationsOptions = createDestinationOptionsTemplate(destinationsList);
  const offersSelectors = createOffersSelectorTemplate(type, offers, offersList);
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
             <input id="event-destination-${id}" class="event__input event__input--destination" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-${id}" required>
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
             <input class="event__input event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
           </div>
           <button class="event__save-btn btn btn--blue" type="submit">Save</button>
           <button class="event__reset-btn" type="reset">Delete</button>
           ${isNew ? '' : `<button class="event__rollup-btn" type="button">
             <span class="visually-hidden">Open event</span>
           </button>`}
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
  #isNew = false;

  constructor(offers, destinations, point = BLANK_POINT) {
    super();
    this._offers = offers;
    this._destinations = destinations;
    this._destinationsNames = this._destinations.map((destination) => destination.name);
    this._data = PointFormView.parsePointToData(point);

    this.#isNew = point === BLANK_POINT;

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createPointFormTemplate(this._data, this._offers, this._destinationsNames, this.#isNew);
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

    if (!this.#isNew) {
      this.setFormCloseHandler(this._callback.formClose);
    }

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  setFormCloseHandler = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationNameChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    if (this._data.offers.length > 0) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    }
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
        maxDate: dateType === 'dateFrom' ? this._data['dateTo'] : null,
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
      offers: [],
    });
  };

  #destinationNameChangeHandler = (evt) => {
    const destinationValue = evt.target.value;

    if (destinationValue <= 0 || !this._destinationsNames.includes(destinationValue)) {
      evt.target.setCustomValidity('Use cities from the list');
    } else {
      const currentDestination = this._destinations.find((destination) => destination.name === destinationValue);

      this.updateData({
        destination: currentDestination,
      });
    }
  };

  #priceChangeHandler = (evt) => {
    this.updateData({
      price: Number(evt.target.value),
    }, true);
  };

  #offerChangeHandler = (evt) => {
    const currentOfferId = Number(evt.target.dataset.offerId);
    const currentOffers = this._offers.find((offer) => offer.type === this._data.type);
    const selectedOffer = currentOffers.offers.find((offer) => offer.id === currentOfferId);

    if (evt.target.checked) {
      this.updateData({
        offers: [...this._data.offers, selectedOffer]
      }, true);
    } else {
      this.updateData({
        offers: [...this._data.offers.filter((offer) => offer.id !== selectedOffer.id)]
      }, true);
    }
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClose();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointFormView.parseDataToPoint(this._data));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointFormView.parseDataToPoint(this._data));
  };

  static parsePointToData = (point) => ({...point});
  static parseDataToPoint = (data) => ({...data});
}

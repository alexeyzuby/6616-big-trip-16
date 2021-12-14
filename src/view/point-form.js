import {firstLetterToUpperCase} from '../utils';
import {POINT_TYPES, DESTINATION_NAMES} from '../const';
import dayjs from 'dayjs';

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
      <div class="event__available-offers">
        ${offers}
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

export const createPointFormTemplate = (points = {}) => {
  const {
    id = 1,
    dateFrom = dayjs(),
    dateTo = dayjs(),
    type = 'train',
    price = '',
    destination = '',
    pointOffers = {
      type: 'train',
      offers: []
    }
  } = points;

  const typesItems = createTypesItemsTemplate(id, POINT_TYPES);
  const destinationsOptions = createDestinationOptionsTemplate(DESTINATION_NAMES);
  const offersSelectors = createOffersSelectorTemplate(id, pointOffers);
  const destinationPictures = createDestinationPicturesTemplate(destination);

  const startTime = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const endTime = dayjs(dateTo).format('DD/MM/YY HH:mm');

  return (
    `<form class="event event--edit" action="#" method="post">
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
         <input class="event__input event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-${id}">
         <datalist id="destination-list-${id}">
           ${destinationsOptions}
         </datalist>
       </div>
       <div class="event__field-group  event__field-group--time">
         <label class="visually-hidden" for="event-start-time-${id}">From</label>
         <input class="event__input event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startTime}">
         &mdash;
         <label class="visually-hidden" for="event-end-time-${id}">To</label>
         <input class="event__input event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endTime}">
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
   </form>`
  );
};

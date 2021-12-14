import dayjs from 'dayjs';

const getPointDuration = (dateFrom, dateTo) => {
  const HOURS = 24;
  const MINUTES = 60;

  const minutes = dayjs(dateTo).diff(dateFrom, 'minute');
  const hours = minutes ? Math.floor(minutes / MINUTES) : 0;
  const days = hours ? Math.floor(hours / HOURS) : 0;

  const daysDuration = days ? `${String(days)}D` : '';
  const hoursDuration = hours ? `${String(hours % HOURS)}H` : '';
  const minutesDuration = minutes ? `${String(minutes % MINUTES)}M` : '';

  return `${daysDuration} ${hoursDuration} ${minutesDuration}`.trim();
};

const createOffersTemplate = (pointOffers) => {
  const checkedOffers = pointOffers.offers.filter((offer) => offer.isChecked);

  return (
    `${checkedOffers.length ? `<ul class="event__selected-offers">
        ${checkedOffers.map((offer) => `<li class="event__offer">
         <span class="event__offer-title">${offer.title}</span>
         &plus;&euro;&nbsp;
         <span class="event__offer-price">${offer.price}</span>
       </li>`).join('')}
      </ul>` : ''}`
  );
};

export const createPointTemplate = (points) => {
  const {dateFrom, dateTo, type, price, destination, pointOffers, isFavorite} = points;

  const pointDuration = getPointDuration(dateFrom, dateTo);
  const selectedOffers = createOffersTemplate(pointOffers);

  return (
    `<div class="event">
     <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${dayjs(dateFrom).format('MMM DD')}</time>
     <div class="event__type">
       <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
     </div>
     <h3 class="event__title">${type} ${destination.name}</h3>
     <div class="event__schedule">
       <p class="event__time">
         <time class="event__start-time" datetime="${dayjs(dateFrom).format('YYYY-MM-DDTHH:mm')}">${dayjs(dateFrom).format('HH:mm')}</time>
         &mdash;
         <time class="event__end-time" datetime="${dayjs(dateTo).format('YYYY-MM-DDTHH:mm')}">${dayjs(dateTo).format('HH:mm')}</time>
       </p>
       <p class="event__duration">${pointDuration}</p>
     </div>
     <p class="event__price">
       &euro;&nbsp;<span class="event__price-value">${price}</span>
     </p>
     <h4 class="visually-hidden">Offers:</h4>
     ${selectedOffers}
     <button class="event__favorite-btn${isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
       <span class="visually-hidden">Add to favorite</span>
       <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
         <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
       </svg>
     </button>
     <button class="event__rollup-btn" type="button">
       <span class="visually-hidden">Open event</span>
     </button>
   </div>`
  );
};

import {getRandomInteger} from '../utils';

const OFFER_PRICE_MIN = 10;
const OFFER_PRICE_MAX = 200;

const offerTypes = {
  ship: [
    {
      name: 'meal',
      title: 'Add meal'
    }
  ],
  drive: [
    {
      name: 'rent',
      title: 'Rent a car'
    }
  ],
  bus: [
    {
      name: 'pillow',
      title: 'Put a pillow'
    }
  ],
  train: [
    {
      name: 'linen',
      title: 'Add bed linen'
    }
  ],
  restaurant: [
    {
      name: 'table',
      title: 'Book a table'
    }
  ],
  'check-in': [
    {
      name: 'breakfast',
      title: 'Add breakfast'
    }
  ],
  flight: [
    {
      name: 'business',
      title: 'Upgrade to a business class'
    },
    {
      name: 'luggage',
      title: 'Add luggage'
    }
  ],
  taxi: [
    {
      name: 'radio',
      title: 'Choose the radio station'
    },
    {
      name: 'comfort',
      title: 'Switch to comfort class'
    }
  ],
  sightseeing: [
    {
      name: 'tickets',
      title: 'Book tickets'
    },
    {
      name: 'lunch',
      title: 'Lunch in city'
    },
  ]
};

const generateOffers = (type) => {
  const offerItem = offerTypes[type];

  return offerItem.map((offer, index) => ({
    id: index + 1,
    name: offer.name,
    title: offer.title,
    price: getRandomInteger(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
    isChecked: Boolean(getRandomInteger())
  }));
};

export const generateOffer = (type) => ({
  type,
  offers: generateOffers(type)
});

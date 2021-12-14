import {getRandomInteger} from '../utils';
import {OFFER_TYPES, OFFER_PRICES} from '../const';

const generateOffers = (type) => {
  const offerItem = OFFER_TYPES[type];

  return offerItem.map((offer, index) => ({
    id: index + 1,
    name: offer.name,
    title: offer.title,
    price: getRandomInteger(OFFER_PRICES.MIN, OFFER_PRICES.MAX),
    isChecked: Boolean(getRandomInteger())
  }));
};

export const generateOffer = (type) => ({
  type,
  offers: generateOffers(type)
});

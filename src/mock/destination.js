import {getRandomInteger} from '../utils';
import {DESTINATION_NAMES, DESTINATION_DESCRIPTION, DESTINATION_PICTURE, DESCRIPTION_LENGTH, PICTURES_COUNT} from '../const';

const generateDescription = () => {
  const descriptionLength = getRandomInteger(DESCRIPTION_LENGTH.MIN, DESCRIPTION_LENGTH.MAX);
  const descriptionSuggestions = DESTINATION_DESCRIPTION.split('. ');

  return `${descriptionSuggestions.slice(0, descriptionLength).join('. ')}.`;
};

const generatePictures = () => {
  const picturesCount = getRandomInteger(PICTURES_COUNT.MIN, PICTURES_COUNT.MAX);

  return [...Array(picturesCount)].map(() => (
    {
      src: `${DESTINATION_PICTURE}${Math.random()}`,
      description: generateDescription()
    }
  ));
};

export const generateDestination = () => ({
  name: DESTINATION_NAMES[getRandomInteger(0, DESTINATION_NAMES.length - 1)],
  description: generateDescription(),
  pictures: generatePictures()
});

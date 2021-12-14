import {getRandomInteger} from '../utils';
import {DESTINATION_NAMES} from '../const';

const DESCRIPTION_LENGTH_MIN = 1;
const DESCRIPTION_LENGTH_MAX = 5;
const PICTURES_COUNT_MIN = 0;
const PICTURES_COUNT_MAX = 5;

const generateDescription = () => {
  const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const descriptionLength = getRandomInteger(DESCRIPTION_LENGTH_MIN, DESCRIPTION_LENGTH_MAX);
  const descriptionSuggestions = description.split('. ');

  return `${descriptionSuggestions.slice(0, descriptionLength).join('. ')}.`;
};

const generatePictures = () => {
  const picture = 'https://picsum.photos/248/152?r=';
  const picturesCount = getRandomInteger(PICTURES_COUNT_MIN, PICTURES_COUNT_MAX);

  return [...Array(picturesCount)].map(() => (
    {
      src: `${picture}${Math.random()}`,
      description: generateDescription()
    }
  ));
};

export const generateDestination = () => ({
  name: DESTINATION_NAMES[getRandomInteger(0, DESTINATION_NAMES.length - 1)],
  description: generateDescription(),
  pictures: generatePictures()
});

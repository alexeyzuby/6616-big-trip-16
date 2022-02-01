import FiltersView from '../view/filters-view';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {FilterType, UpdateType} from '../utils/const';
import {Filters} from '../utils/filters';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersComponent = null;
  #pointsModel = null;
  #filtersModel = null;

  constructor(filtersContainer, pointsModel, filtersModel) {
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        count: Filters[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        count: Filters[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        count: Filters[FilterType.PAST](points).length,
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFiltersComponent = this.#filtersComponent;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#filtersComponent = new FiltersView(filters, this.#filtersModel.filter);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFiltersComponent === null) {
      render(this.#filtersContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  };

  destroy = () => {
    remove(this.#filtersComponent);
    this.#filtersComponent = null;

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filtersModel.removeObserver(this.#handleModelEvent);

    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

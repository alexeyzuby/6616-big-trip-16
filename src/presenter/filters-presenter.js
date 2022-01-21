import FiltersView from '../view/filters-view';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {FilterType, UpdateType} from '../utils/const.js';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersComponent = null;
  #filtersModel = null;

  constructor(filterContainer, filterModel) {
    this.#filtersContainer = filterContainer;
    this.#filtersModel = filterModel;

    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything'
      },
      {
        type: FilterType.FUTURE,
        name: 'Future'
      },
      {
        type: FilterType.PAST,
        name: 'Past'
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView(filters, this.#filtersModel.filter);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFiltersComponent === null) {
      render(this.#filtersContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  destroy = () => {
    remove(this.#filtersComponent);
    this.#filtersComponent = null;

    this.#filtersModel.removeObserver(this.#handleModelEvent);

    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  }
}

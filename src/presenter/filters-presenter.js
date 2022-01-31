import FiltersView from '../view/filters-view';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {FilterType, UpdateType} from '../utils/const';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersComponent = null;
  #filtersModel = null;

  constructor(filtersContainer, filtersModel) {
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
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

    this.#filtersModel.addObserver(this.#handleModelEvent);

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

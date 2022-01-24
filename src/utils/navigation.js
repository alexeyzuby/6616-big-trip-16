export const switchNavigationActive = (items, defaultItem, activeClass) => {
  items.forEach((item) => {
    item.classList[item.dataset.navigationName === defaultItem ? 'add' : 'remove'](activeClass);
  });
};

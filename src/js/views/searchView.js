import View from './View.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  _clearField() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearField();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();

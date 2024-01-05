import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import 'core-js/stable';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update recipe view to mark selected id active
    if (model.state.search.results.length) {
      resultsView.update(model.getSearchResultsPage());
    }
    // 1) Load recipe
    await model.loadRecipe(id);
    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load Search Results
    await model.loadSearchResults(query);

    // 3) Render results
    console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) Re-render the search results of respective page
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Re-render the pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Change the state in model
  model.calculateServings(newServings);

  // Re-render the recipeView to reflect the changed state in UI (keeping state and UI in sync with each other)
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
};
init();

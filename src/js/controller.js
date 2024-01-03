import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import 'core-js/stable';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 1) Load recipe
    await model.loadRecipe(id);
    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
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
    resultsView.render(model.state.search.results);
  } catch (err) {
    resultsView.renderError();
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();

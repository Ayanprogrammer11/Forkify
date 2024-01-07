import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import 'core-js/stable';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update recipe view to mark selected id active
    if (model.state.search.results.length) {
      resultsView.update(model.getSearchResultsPage());
    }
    if (model.state.bookmarks.length)
      bookmarksView.render(model.state.bookmarks);
    // 1) Load recipe
    await model.loadRecipe(id);
    // 2) Render recipe
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);
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
  model.updateServings(newServings);

  // Re-render the recipeView to reflect the changed state in UI (keeping state and UI in sync with each other)
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // 1) Add/delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Updating recipe view
  recipeView.update(model.state.recipe);
  // 3) Rendering bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlStoredBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    window.history.pushState(null, '', model.state.recipe.id);

    bookmarksView.render(model.state.bookmarks);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥', err);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  bookmarksView.addHandlerRenderStoredBookmark(controlStoredBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

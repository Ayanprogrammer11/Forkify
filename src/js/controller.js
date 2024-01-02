import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import 'core-js/stable';
import * as model from './model.js';
import recipeView from './views/recipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  recipeView.renderSpinner();
  // 1) Load recipe
  await model.loadRecipe(id);
  // 2) Render recipe
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};
init();

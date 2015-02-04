//= require_self

//= require ../helpers/analytics
//= require ../helpers/routes
//= require ../helpers/xhr
//= require_tree ../constants
//= require_tree ../dispatchers
//= require_tree ../stores
//= require_tree ./components
//= require_tree ./actions

window.bubble = {};
window.scribble = {};
scribble.helpers = {};

bubble.init = function () {
  SessionStore.initialize();

  return this;
}

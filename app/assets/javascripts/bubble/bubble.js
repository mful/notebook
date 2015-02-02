//= require_self

//= require ../helpers/analytics
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
  window.scribble.context = scribble_bootstrap;
  SessionStore.initialize();

  return this;
}

//= require_self

//= require ../shared/helpers/analytics
//= require ../shared/helpers/routes
//= require ../shared/helpers/url
//= require ../shared/helpers/xhr
//= require_tree ../shared/constants
//= require_tree ../shared/dispatchers
//= require ../shared/mediators/courier
//= require_tree ./stores
//= require_tree ./mediators
//= require_tree ./components
//= require_tree ./actions

window.corkboard = {};
window.scribble = {};
scribble.helpers = {};

corkboard.init = function () {
  SessionStore.initialize();

  return this;
}

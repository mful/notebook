//= require_self

//= require ../helpers/analytics
//= require ../helpers/routes
//= require ../helpers/url
//= require ../helpers/xhr
//= require_tree ../constants
//= require_tree ../dispatchers
//= require_tree ../stores
//= require_tree ./components
//= require_tree ./actions
//= require_tree ./mediators

window.janus = {};
window.scribble = {};
scribble.helpers = {};

janus.init = function () {
  SessionStore.initialize();
  Courier.initialize();

  return this;
}

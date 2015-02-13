//= require_self

//= require_tree ../shared/helpers
//= require_tree ./constants
//= require_tree ./dispatcher
//= require_tree ./routers
//= require_tree ./stores
//= require_tree ./components
//= require_tree ./actions

window.scribble = {};
scribble.helpers = {};

scribble.init = function () {
  window.scribble.context = scribble_bootstrap;
  window.scribble.router = new NotebookRouter();
  SessionStore.initialize();
};

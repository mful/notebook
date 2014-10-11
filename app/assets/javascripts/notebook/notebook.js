//= require_self

//= require_tree ../helpers
//= require_tree ./constants
//= require_tree ./dispatcher
//= require_tree ./stores
//= require_tree ./components
//= require_tree ./actions

window.scribble = {};
scribble.helpers = {};

scribble.init = function () {
  scribble.context = scribble_bootstrap;
};

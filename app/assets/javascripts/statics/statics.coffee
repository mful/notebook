#= require_self
#
#= require_tree ./views

window.scribble = {}
scribble.statics = {}
scribble.helpers = {}
scribble.statics.views = {}

scribble.statics.initThanks = ->
  new scribble.statics.views.ThanksView().render()

scribble.statics.initLanding = ->
  new scribble.statics.views.LandingView().render()

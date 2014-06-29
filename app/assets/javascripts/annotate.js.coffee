#= require_self
#= require_tree ./models
#= require_tree ./highlighter
#= require_tree ./sidebar

window.annotate or= {}
annotate.baseDomain = 'http://localhost:3000'
annotate.models = {}

annotate.init = ->
  annotate.vent = ev(document.createElement('div'))
  annotate.highlighter = new annotate.Highlighter()
  annotate.sidebar = new annotate.Sidebar()

  annotate.delegateEvents()

  this

annotate.delegateEvents = ->
  annotate.vent.on 'annotation:new', annotate.newAnnotation

annotate.isBlank = (string) ->
  !string || /^\s*$/.test(string)

annotate.newAnnotation = ->
  annotate.activeAnnotation.save (err, res) =>
    url = annotate.baseDomain + '/annotation/' + res.annotation.id
    annotate.sidebar.render(url)

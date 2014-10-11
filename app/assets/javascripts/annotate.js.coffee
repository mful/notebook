#= require_self
#= require_tree ./dev_crayon/models
#= require_tree ./dev_crayon/highlighter
#= require_tree ./dev_crayon/sidebar

window.annotate or= {}
annotate.baseDomain = 'http://localhost:3000'
annotate.containerId = 'annotate-wrapper'
annotate.models = {}

annotate.init = ->
  annotate.container = annotate.appendContainer()
  annotate.vent = ev(document.createElement('div'))
  annotate.highlighter = new annotate.Highlighter()
  annotate.sidebar = new annotate.Sidebar()

  annotate.delegateEvents()

  this

annotate.appendContainer = ->
  container = document.createElement('div')
  container.id = annotate.containerId
  document.body.appendChild(container)

annotate.delegateEvents = ->
  annotate.vent.on 'annotation:new', annotate.newAnnotation

annotate.isBlank = (string) ->
  !string || /^\s*$/.test(string)

annotate.newAnnotation = ->
  annotate.activeAnnotation.save (err, res) =>
    url = annotate.baseDomain + '/annotations/' + res.annotation.id
    annotate.sidebar.navigate(url)

annotate.debounce = (func, timeout) ->
  timer = null
  ->
    clearTimeout(timer) if timer
    timer = setTimeout(func, timeout)

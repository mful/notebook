class annotate.Highlighter.WidgetView 

  id: 'annotate-widget'

  constructor: ->
    @element = @_template()
    @delegateEvents()

  delegateEvents: ->
    ev(@element.getElementsByClassName('create-annotation')[0]).on(
      'click', 
      @notifyCreateAnnotation
    )

  render: (model) =>
    @model = model
    document.body.appendChild(@element) unless document.getElementById(@id) 
    @show() 

    this

  show: ->
    @element.style.display = 'block'

  hide: ->
    @element.style.display = 'none'

  notifyCreateAnnotation: =>
    annotate.activeAnnotation = @model
    annotate.vent.fireEvent annotate.vent.el, 'annotation:new'

  _template: (model) ->
    contents = """
      <div class="create-annotation">create annotation +</div>
    """
    container = document.createElement('div')
    container.id = @id
    container.innerHTML = contents

    container

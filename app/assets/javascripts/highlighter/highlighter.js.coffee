class annotate.Highlighter

  constructor: ->
    @delegateEvents()
    @widgetView = new annotate.Highlighter.WidgetView()

  delegateEvents: ->
    ev(document).on 'mouseup', @highlight

  highlight: =>
    selection = @getSelection()
    if selection 
      @widgetView.render(new annotate.models.Annotation(selection)) 
    else
      @widgetView.hide()

  getSelection: =>
    sel = window.getSelection()
    if sel.rangeCount > 1
      sel
    else if sel.rangeCount is 1
      blank = annotate.isBlank(sel.getRangeAt(0).cloneContents().textContent)
      if blank then null else sel
    else
      null

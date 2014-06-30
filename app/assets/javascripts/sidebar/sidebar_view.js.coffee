class annotate.Sidebar.SidebarView

  id: 'annotate-sidebar'

  constructor: ->
    console.log 'SidebarView'
    @element = @_template()
    @iframe = @element.getElementsByTagName('iframe')[0]
    @rendered = false
    @_debouncedResize = annotate.debounce(@resize, 25)
    @delegateEvents()

  delegateEvents: =>
    ev(window).on('resize', @_debouncedResize)

  render: ->
    annotate.container.appendChild(@element)
    @rendered = true

  navigate: (url) ->
    @iframe.src = url
    @render() unless @rendered

  _template: ->
    contents = """
      <iframe src="" height="#{window.innerHeight}" width="350"></iframe>
    """

    container = document.createElement('div')
    container.id = @id
    container.innerHTML = contents

    container

  resize: =>
    @iframe.height = window.innerHeight
class annotate.Sidebar

  constructor: ->
    @sidebarView = new annotate.Sidebar.SidebarView()

  navigate: (url) ->
    @sidebarView.navigate(url)

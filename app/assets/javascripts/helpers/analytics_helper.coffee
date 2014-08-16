scribble.helpers or= {}
scribble.helpers.analytics = {}

((namespace) ->

  namespace.trackGoogleEvent = (category, action, label = null, value = null) ->
    ga('send', 'event', category, action, label, value) if ga?

)(scribble.helpers.analytics)

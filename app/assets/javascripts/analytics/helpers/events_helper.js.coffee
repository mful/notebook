scribble.analytics or= {}
scribble.analytics.helpers or= {}
scribble.analytics.helpers.events = {}

((namespace) ->

  namespace.trackGoogleEvent = (category, action, label = null, value = null) ->
    ga('send', 'event', category, action, label, value) if ga?

)(scribble.analytics.helpers.events)

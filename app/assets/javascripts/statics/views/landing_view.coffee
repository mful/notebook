class scribble.statics.views.LandingView

  constructor: ->
    # do nothing

  render: ->
    @delegateEvents()

  delegateEvents: =>
    ev(document.getElementById('top-signup')).on('click', @trackTopSignup)
    ev(document.getElementById('hiw-signup')).on('click', @trackHowItWorksSignup)

  trackTopSignup: =>
    _trackSignup('Top')

  trackHowItWorksSignup: =>
    _trackSignup('How It Works')

  _trackSignup = (location) ->
    scribble.helpers.analytics.trackGoogleEvent(
      'Landing Page',
      'Sign Up',
      location
    )

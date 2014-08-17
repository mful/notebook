class scribble.statics.views.LandingView

  constructor: ->
    # do nothing

  render: ->
    @delegateEvents()

  delegateEvents: =>
    ev(document.getElementById('top-signup')).on('click', @trackTopSignup)
    ev(document.getElementById('hiw-signup')).on('click', @trackHowItWorksSignup)
    ev(document.getElementById('menu-burger')).on('click', @toggleMenu)

  toggleMenu: =>
    @menu or= document.getElementById('baby-nav')
    if @menu.style.display is 'block'
      @menu.style.display = 'none'
    else
      @menu.style.display = 'block'

  trackTopSignup: =>
    _trackSignup('Top')

  trackHowItWorksSignup: =>
    _trackSignup('How It Works')

  # private

  _trackSignup = (location) ->
    scribble.helpers.analytics.trackGoogleEvent(
      'Landing Page',
      'Sign Up',
      location
    )

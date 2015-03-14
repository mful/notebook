class scribble.statics.views.ThanksView

  constructor: ->

  render: ->
    @delegateEvents()

  delegateEvents: =>
    ev(document.getElementById('fb-share')).on('click', @fbShare)
    ev(document.getElementById('twitter-share')).on('click', @twitterShare)
    ev(document.getElementById('email-share')).on('click', @emailShare)

  fbShare: (e) =>
    e.preventDefault()
    _trackShare('FB')
    FB.ui
      method: 'send'
      link: 'https://scribblely.herokuapp.com'

  twitterShare: (e) =>
    _trackShare('Twitter')

  emailShare: =>
    _trackShare('Email')

  _trackShare = (platform, options = {}) ->
    scribble.analytics.helpers.events.trackGoogleEvent(
      'Share',
      platform,
      options.label,
      options.value
    )

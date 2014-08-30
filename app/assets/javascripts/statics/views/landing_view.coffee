class scribble.statics.views.LandingView

  constructor: ->
    # do nothing

  render: ->
    @setupTests()
    @delegateEvents()

  setupTests: =>
    _headlineTest()
    _ctaTest()

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
    Abba('Landing Headline').complete(label: location)

  _headlineTest = ->
    Abba('Landing Headline')
      .control('Add Context Anywhere')
      .variant('Intelligent Discussion Anywhere', ->
        document.getElementById('headline').innerHTML = """
          <span class="callout">Intelligent Discussion</span> Anywhere.
        """
      )
      .start()

  _ctaTest = ->
    Abba('CTA Test')
      .control('Get Notified')
      .variant('Join Beta', ->
        headers = document.getElementsByClassName('cta-header')
        buttons = document.getElementsByClassName('beta-button')
        headerCount = 0
        buttonCount = 0

        while headerCount < headers.length
          headers[headerCount].innerText = 'Join beta, get early access'
          headerCount++

        while buttonCount < buttons.length
          buttons[buttonCount].innerText = 'Join Beta'
          buttonCount++
      )
      .variant('Reserve Username', ->
        headers = document.getElementsByClassName('cta-header')
        buttons = document.getElementsByClassName('beta-button')
        inputs = document.getElementsByClassName('input-username')
        headerCount = 0
        buttonCount = 0
        inputCount = 0

        while headerCount < headers.length
          headers[headerCount].innerText = 'Reserve Username'
          headerCount++

        while buttonCount < buttons.length
          buttons[buttonCount].innerText = 'Reserve'
          buttonCount++

        while inputCount < inputs.length
          inputs[inputCount].style.display = 'block'
          inputCount++
      )
      .start()

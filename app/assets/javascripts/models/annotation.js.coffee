annotate.models or= {}

class annotate.models.Annotation

  attributes:
    text: null

  constructor: (selection) ->
    @attributes.text = @parseText(selection)

  parseText: (selection) ->
    i = 0
    text = ''

    while i < selection.rangeCount
      text += selection.getRangeAt(i).cloneContents().textContent + ' '
      i++

    text.trim()

  save: (callback) ->
    post(
      annotate.baseDomain + '/api/annotations',
      {annotation: @attributes, url: 'http://google.com'}#window.location.href},
      callback
    )

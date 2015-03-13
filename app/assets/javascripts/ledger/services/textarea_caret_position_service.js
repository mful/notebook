var TextareaCaretPositionService = ( function ( exports ) {

  var properties = [
      'direction',
      'boxSizing',
      'width',
      'height',
      'overflowX',
      'overflowY',

      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',

      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',

      'fontStyle',
      'fontVariant',
      'fontWeight',
      'fontStretch',
      'fontSize',
      'fontSizeAdjust',
      'lineHeight',
      'fontFamily',

      'textAlign',
      'textTransform',
      'textIndent',
      'textDecoration',

      'letterSpacing',
      'wordSpacing'
    ];

  function TextareaCaretPositionService () {};

  TextareaCaretPositionService.prototype.get = function ( node, position ) {
    var mirror = this.createMirror( node, position ),
        placeholder = this.injectSpan( mirror, node, position ),
        coords = this.getCoords( node, placeholder );

    document.body.removeChild( mirror );

    return coords;
  };

  TextareaCaretPositionService.prototype.createMirror = function ( textarea, position ) {
    var div = document.createElement( 'div' ), // mirrored div
        style = div.style,
        computed = getComputedStyle( textarea );

    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild( div );

    style.whiteSpace = 'pre-wrap';
    style.wordWrap = 'break-word';

    // position off-screen
    style.position = 'absolute';  // required to return coordinates properly
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

    // transfer the element's properties to the div
    properties.forEach( function ( prop ) {
      style[prop] = computed[prop];
    });

    div.textContent = textarea.value.substring( 0, position );

    return div;
  };

  TextareaCaretPositionService.prototype.injectSpan = function ( parent, textarea, position ) {
    var span = document.createElement( 'span' );

    // Wrapping must be replicated *exactly*, including when a long word gets
    // onto the next line, with whitespace at the end of the line before (#7).
    // The  *only* reliable way to do that is to copy the *entire* rest of the
    // textarea's content into the <span> created at the caret position.
    // for inputs, just '.' would be enough, but why bother?
    span.textContent = textarea.value.substring( position ) || '.';  // || because a completely empty faux span doesn't render at all
    parent.appendChild( span );

    return span;
  };

  TextareaCaretPositionService.prototype.getCoords = function ( textarea, placeholder ) {
    var computed = getComputedStyle( textarea ),
        rect = textarea.getBoundingClientRect(),
        offsetTop = placeholder.offsetTop < textarea.clientHeight ?
                      placeholder.offsetTop :
                      textarea.clientHeight;

    return {
      top: offsetTop + parseInt( computed['borderTopWidth'] ) + rect.top,
      left: placeholder.offsetLeft + parseInt( computed['borderLeftWidth'] ) + rect.left
    };
  };

  return TextareaCaretPositionService;

})( window );

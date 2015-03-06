/** @jsx React.DOM */

var AtMentionDropdown = React.createClass({

  // lifecycle handlers

  getInitialState: function () {
    var text = this.props.text.substring( 1 ).trim();
    return {text: text, contentNode: this.props.contentNode};
  },

  componentDidMount: function () {
    UserStore.addChangeListener( this._onChange );
    this.debouncedFetchUser = scribble.helpers.utility.debounce( this._fetchUser, 300 )

    this._fetchUser( this.state.text );

    this.setPosition();
    this.refs.component.getDOMNode().style.visibility = 'visible';
  },

  componentDidUpdate: function () {
    this.setPosition();
  },

  componentWillUnmount: function () {
    UserStore.removeChangeListener( this._onChange );
  },

  componentWillReceiveProps: function ( props ) {
    var text = props.text.substring( 1 );
    if ( text === this.state.text ) return;

    this.debouncedFetchUser( text );

    this.setState({ text: text });
  },

  // event handlers

  completeMention: function ( e ) {
    this.props.atMentionHandler( e.target.innerText );
  },

  // render helpers

  getCursorPosition: function ( node, position ) {
    var properties = [
      'direction',  // RTL support
      'boxSizing',
      'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
      'height',
      'overflowX',
      'overflowY',  // copy the scrollbar for IE

      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',

      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',

      // https://developer.mozilla.org/en-US/docs/Web/CSS/font
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
      'textDecoration',  // might not make a difference, but better be safe

      'letterSpacing',
      'wordSpacing'
    ];

    var div = document.createElement( 'div' ), // mirrored div
        style = div.style,
        span = document.createElement( 'span' ),
        computed = getComputedStyle( node ),
        rect = node.getBoundingClientRect(),
        coordinates, maxOffset, offsetTop;

    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild( div );

    style.whiteSpace = 'pre-wrap';
    style.wordWrap = 'break-word';

    // position off-screen
    style.position = 'absolute';  // required to return coordinates properly
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

    // MAY NEED TO TRANSFER SPECIFIC STYLE PROPERTIES
    // transfer the element's properties to the div
    properties.forEach(function (prop) {
      style[prop] = computed[prop];
    });

    div.textContent = node.value.substring( 0, position );
    // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
    // div.textContent = div.textContent.replace( /\s/g, "\u00a0" );

    // Wrapping must be replicated *exactly*, including when a long word gets
    // onto the next line, with whitespace at the end of the line before (#7).
    // The  *only* reliable way to do that is to copy the *entire* rest of the
    // textarea's content into the <span> created at the caret position.
    // for inputs, just '.' would be enough, but why bother?
    span.textContent = node.value.substring( position ) || '.';  // || because a completely empty faux span doesn't render at all
    div.appendChild(span);

    // newLineCount = !!node.value.match( /\n/g ) ? node.value.match( /\n/g ).length : 0;
    // + ( newLineCount * parseInt(computed['lineHeight']) )

    // For when text overflows, and the textarea scrolls
    offsetTop = span.offsetTop < node.clientHeight ? span.offsetTop : maxOffset;

    coordinates = {
      top: offsetTop + parseInt( computed['borderTopWidth'] ) + rect.top,
      left: span.offsetLeft + parseInt( computed['borderLeftWidth'] ) + rect.left
    };

    document.body.removeChild(div);

    return coordinates;
  },

  setPosition: function () {
    var node = this.refs.component.getDOMNode(),
        underRoom = 15,
        aboveRoom = 22,
        coords = this.getCursorPosition(
          this.state.contentNode,
          this.state.contentNode.selectionEnd
        ),
        lineHeight = parseInt( getComputedStyle(node)['lineHeight'] );

    if ( coords.top + node.clientHeight + lineHeight > window.innerHeight ) {
      node.style.top = coords.top - node.clientHeight - lineHeight + 'px';
    } else {
      node.style.top = coords.top + lineHeight + 'px';
    }
  },

  userListItems: function () {
    var _this = this;

    if ( this.state.users && this.state.users.length > 0 ) {
      return this.state.users.map( function ( user ) {
        // TODO: Move to own component? click handling
        return <li key={ user.id } onClick={ _this.completeMention }>{ '@' + user.username }</li>;
      });
    } else if ( !this.state.text ) {
      return null;
    } else if ( !this.state.users ) {
      return <li className="empty">searching...</li>
    } else {
      return <li className="empty">No users found :(</li>
    }
  },

  render: function () {
    return (
      <div ref="component" className="at-mention-dropdown-component">
        <ul>
          { this.userListItems() }
        </ul>
      </div>
    );
  },

  _onChange: function () {
    this.setState({
      users: UserStore.atMentionUsers()
    });
  },

  _fetchUser: function ( text ) {
    var _this = this;

    if ( text && text.trim() ) {
      UserActions.fetchNameMatches( text.trim(), function ( users ) {
        _this.setState({ users: users });
      });
    }
  }

});

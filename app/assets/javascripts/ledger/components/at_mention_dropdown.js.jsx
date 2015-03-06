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

  setPosition: function () {
    var node = this.refs.component.getDOMNode(),
        underRoom = 15,
        aboveRoom = 22,
        coords = new TextareaCaretPositionService().get(
          this.state.contentNode,
          this.state.contentNode.selectionEnd
        ),
        lineHeight = parseInt( getComputedStyle(this.state.contentNode)['lineHeight'] ) || 0;

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

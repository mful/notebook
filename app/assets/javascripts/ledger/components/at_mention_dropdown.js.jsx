/** @jsx React.DOM */

var AtMentionDropdown = React.createClass({

  // lifecycle handlers

  getInitialState: function () {
    var text = this.props.text.substring( 1 ).trim();

    this.startUserFetch( text );

    return {text: text};
  },

  componentDidMount: function () {
    UserStore.addChangeListener( this._onChange );
  },

  componentWillUnmount: function () {
    UserStore.removeChangeListener( this._onChange );
  },

  componentWillReceiveProps: function ( props ) {
    var text = this.props.text.substring( 1 );
    if ( text === this.state.text ) return;

    this.startUserFetch( text );

    this.setState({ text: text });
  },

  startUserFetch: function ( text ) {
    var _this = this;

    if ( text.trim() ) {
      UserActions.fetchNameMatches( text, function ( users ) {
        stateObj.users = users;
        _this.setState({ users: users });
      });
    }
  },

  // render helpers

  userListItems: function () {
    if ( this.state.users && this.state.users.length > 0 ) {
      return this.state.users.map( function ( user ) {
        // TODO: Move to own component? click handling
        return <li key={ user.id }>{ '@' + user.username }</li>;
      });
    } else if ( !this.state.text ) {
      return null;
    } else if ( !this.state.users ) {
      return <li>searching...</li>
    } else {
      return <li>No users found :(</li>
    }
  },

  render: function () {
    return (
      <div className="at-mention-dropdown-component">
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
  }

});



































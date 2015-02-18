/** @jsx React.DOM */

var UsernameInput = React.createClass({

  getInitialState: function () {
    return {
      visible: this.props.visible,
      errors: this.props.error
    };
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({ visible: props.visible });
  },

  visibilityClass: function () {
    return( this.state.visible ? '' : 'hidden' );
  },

  errorMessage: function () {
    if ( !this.state.error ) {
      return [];
    } else {
      return SessionStore.userErrors();
    }
  },

  submitUsername: function ( e ) {
    e.preventDefault();

    SessionActions.updateCurrentUser({
      username: this.refs.username.getDOMNode().value.trim()
    });
  },

  render: function () {
    return(
      <form id="username-select-component" className={ this.visibilityClass() } onSubmit={ this.submitUsername }>

        <input name="user[username]" id="user_username" ref="username" type="text" placeholder="pick your username" />
        <button type="submit" className="large button">Finish</button>
      </form>
    );
  }
});

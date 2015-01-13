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

  submitUsername: function () {
    SessionActions.updateCurrentUser({
      username: this.refs.username.getDOMNode().value.trim()
    });
  },

  render: function () {
    return(
      <form id="username-select-component" className={ this.visibilityClass() } onSubmit={ this.submitUsername }>
        <FlashComponent visible={ this.state.error } type="error" messages={ this.errorMessage() } />

        <input ref="username" type="text" placeholder="pick your username" />
        <button type="submit">Finish</button>
      </form>
    );
  }
});

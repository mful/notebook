/** @jsx React.DOM */

var EmailSignupForm = React.createClass({

  getInitialState: function () {
    return {
      login: false,
      visible: this.props.visible,
      error: this.props.error
    };
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({
      login: this.state.login,
      visible: props.visible,
      error: props.error
    });
  },

  handleEmailSubmit: function ( e ) {
    e.preventDefault();

    var data = {
      email: this.refs.email.getDOMNode().value.trim(),
      password: this.refs.password.getDOMNode().value.trim()
    };

    if ( this.state.login ) {
      SessionActions.emailLogin( data );
    } else {
      data.password_confirmation = this.refs.passwordConfirmation.getDOMNode().value.trim();
      SessionActions.createUserWithEmail( data );
    }
  },

  toggleLogin: function () {
    if ( this.state.login ) {
      this.setState( { login: false, error: false } );
    } else {
      this.setState( { login: true, error: false } );
    }
  },

  visiblityClass: function () {
    if ( this.state.visible ) {
      return '';
    } else {
      return 'hidden';
    }
  },

  loginClass: function () {
    if ( this.state.login ) {
      return '';
    } else {
      return 'hidden';
    }
  },

  signupClass: function () {
    if ( this.state.login ) {
      return 'hidden';
    } else {
      return '';
    }
  },

  submitCTA: function () {
    if ( this.state.login ) {
      return 'Login';
    } else {
      return 'Signup';
    }
  },

  errorMessage: function () {
    if ( !this.state.error ) return [];

    if ( this.state.login ) {
      return [ "Whoops! Login info doesn't match a Scribble user. Create Account instead?" ];
    } else {
      return SessionStore.userErrors();
    }
  },

  render: function () {
    return(
      <div id="email-signup-form-component" className={ this.visiblityClass() }>
        <FlashComponent visible={ this.state.error } type="error" messages={ this.errorMessage() } />

        <form id="email-signup-form" onSubmit={ this.handleEmailSubmit }>
          <input ref="email" type="email" id="user_email" name="user[email]" placeholder="email" />
          <input ref="password" type="password" id="user_password" name="user[password]" placeholder="password" />
          <input ref="passwordConfirmation" className={ this.signupClass() } type="password" id="user_password_confirmation" name="user[password_confirmation]" placeholder="password one more time" />

          <button type="submit" id="email-form-submit">{ this.submitCTA() }</button>
        </form>

        <p className={ 'signup-login-toggle ' + this.signupClass() }>Already have an account? <span className="clickable email-login-toggler" onClick={ this.toggleLogin }>Login</span></p>
        <p className={ 'signup-login-toggle ' + this.loginClass() }>New to these parts? <span className="clickable email-login-toggler" onClick={ this.toggleLogin }>Signup</span></p>

        <p className="clickable email-form-toggle" onClick={ this.props.toggleHandler }>
          or connect with Facebook or Google
        </p>
      </div>
    )
  }
});

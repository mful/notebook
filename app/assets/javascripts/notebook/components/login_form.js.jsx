/** @jsx React.DOM */

var LoginForm = React.createClass({

  handleFbLogin: function ( e ) {
    e.preventDefault();
    SessionActions.fbLogin();
  },

  handleGoogleLogin: function ( e ) {
    e.preventDefault();
    SessionActions.googleLogin();
  },

  handleEmailSubmit: function () {

  },

  render: function () {
    return(
      <div>
        <h2 id="modal-header">Login or sign up to post!</h2>

        <button className="fb-login" onClick={ this.handleFbLogin }>
          <i className="ion-social-facebook"></i> Connect With Facebook
        </button>

        <button className="google-login" onClick={ this.handleGoogleLogin }>
          <i className="ion-social-google"></i> Connect With Google
        </button>

        <p id="email-signup-link" className="clickable">or signup with email</p>

        <form id="email-signup-form" onSubmit={ this.handleEmailSubmit }>
        </form>
      </div>
    )
  }
});

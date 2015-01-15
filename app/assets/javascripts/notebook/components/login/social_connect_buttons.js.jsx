/** @jsx React.DOM */

var SocialConnectButtons = React.createClass({

  getInitialState: function () {
    return { visible: this.props.visible };
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({ visible: props.visible });
  },

  handleFbLogin: function ( e ) {
    e.preventDefault();
    SessionActions.fbLogin();
  },

  handleGoogleLogin: function ( e ) {
    e.preventDefault();
    SessionActions.googleLogin();
  },

  visibilityClass: function () {
    if ( this.state.visible ) {
      return '';
    } else {
      return 'hidden';
    }
  },

  render: function () {
    return(
      <div className={ this.visibilityClass() }>
        <button id="fb-login" className="fb-login" onClick={ this.handleFbLogin }>
          <i className="ion-social-facebook"></i> Connect With Facebook
        </button>

        <button id="google-login" className="google-login" onClick={ this.handleGoogleLogin }>
          <i className="ion-social-google"></i> Connect With Google
        </button>

        <p ref="emailSignupLink" className="clickable email-form-toggle" onClick={ this.props.toggleHandler }>
          or signup with email
        </p>
      </div>
    );
  }
});

/** @jsx React.DOM */

var LoginForm = React.createClass({

  getInitialState: function () {
    return { 
      emailSignup: false,
      error: false,
    };
  },

  toggleEmailForm: function () {
    this.setState({
      emailSignup: !this.state.emailSignup,
      error: false
    });
  },

  componentDidMount: function () {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  render: function () {
    return(
      <div id="login-form-component">
        <div id="modal-header">
          <h2 id="modal-header">Quick!</h2>
          <h4 className="subheader">Signup to post.</h4>
        </div>

        <SocialConnectButtons visible={ !this.state.emailSignup } toggleHandler={ this.toggleEmailForm } />
        <EmailSignupForm visible={ this.state.emailSignup } toggleHandler={ this.toggleEmailForm } error={ this.state.error } />

        <p className="privacy-policy">
          we hate spam too - check out our rock solid&nbsp;
          <a target="_blank" href={ scribble.helpers.routes.privacy_policy_url() }>
            privacy policy
          </a>
        </p>
      </div>
    );
  },

  // private

  _onChange: function () {
    user = SessionStore.currentUser();
    if ( user && user.id ) {

    } else {
      this.setState({
        emailSignup: this.state.emailSignup,
        error: true
      });
    }
  }
});

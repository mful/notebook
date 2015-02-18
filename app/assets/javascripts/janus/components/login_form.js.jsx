/** @jsx React.DOM */

var LoginForm = React.createClass({

  getInitialState: function () {
    if ( this.props.header == null ) this.props.header = 'Quick!';
    if ( this.props.subHeader == null ) this.props.subHeader = 'Signup to post.';
    return {
      emailSignup: false,
      error: false,
      header: this.props.header,
      login: false,
      subHeader: this.props.subHeader,
      username: false
    };
  },

  toggleEmailForm: function () {
    this.setState({
      emailSignup: !this.state.emailSignup,
      error: false
    });
  },

  toggleLogin: function () {
    this.setState({
      login: !this.state.login
    });
  },

  getUsername: function () {
    this.setState({
      error: false,
      header: 'Last step!',
      subHeader: 'Pick your username.',
      username: true
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
      <div className="login-form-component">
        <div id="login-header">
          <h2 className="header">{ this.state.header }</h2>
          <h4 className="subheader">{ this.state.subHeader }</h4>
        </div>

        <UsernameInput visible={ this.state.username } error={ this.state.error } />
        <SocialConnectButtons visible={ !this.state.emailSignup && !this.state.username } toggleHandler={ this.toggleEmailForm } />
        <EmailSignupForm visible={ this.state.emailSignup && !this.state.username }
                         toggleHandler={ this.toggleEmailForm }
                         toggleLoginHandler={ this.toggleLogin }
                         error={ this.state.error }
                         login={ this.state.login }  />

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
      if ( user.username == null ) this.getUsername();
    } else {
      this.setState({
        emailSignup: this.state.emailSignup,
        error: true
      });
    }
  }
});

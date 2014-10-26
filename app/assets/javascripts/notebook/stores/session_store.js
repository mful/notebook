var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _currentUser, _userErrors;

var SessionStore = React.addons.update(EventEmitter.prototype, {$merge: {

  initialize: function () {
    _currentUser = scribble.context.current_user.user;
    // don't expose session info globally
    scribble.context.current_user = null;
  },

  currentUser: function () {
    return _currentUser;
  },

  userErrors: function () {
    return _userErrors;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  loginSuccess: function () {
    SessionActions.notifyLogin();
    this.emitChange();
  },

  logoutSuccess: function () {
    _currentUser = null;
    SessionActions.notifyLogout();
    this.emitChange();
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatchToken: AppDispatcher.register(function ( payload ) {
    var action = payload.action;

    switch(action.actionType) {
      case AnnotationConstants.CREATE_WITH_COMMENT:
      case AnnotationConstants.ADD_COMMENT:
        SessionStore._ensureCurrentUser();
        break;
      case SessionConstants.FB_LOGIN:
        SessionStore._loginWithFb();
        break;
      case SessionConstants.GOOGLE_LOGIN:
        SessionStore._loginWithGoogle();
        break;
      case SessionConstants.EMAIL_LOGIN:
        SessionStore._loginWithEmail( action.data );
        break
      case SessionConstants.CREATE_USER_WITH_EMAIL:
        SessionStore._createAndSigninWithEmail( action.data );
        break;
      case SessionConstants.LOGOUT:
        SessionStore._deleteSession();
        break;
    }

    return true;
  }),

  // private

  _ensureCurrentUser: function () {
    if ( !SessionStore.currentUser() ) {
      scribble.router.navigate('/signin');
    }
  },

  _deleteSession: function () {
    scribble.helpers.xhr.request(
      'DELETE',
      scribble.helpers.routes.api_signout_url(),
      function ( err, response ) {
        if ( !err ) SessionStore.logoutSuccess();
      }
    )
  },

  _loginWithFb: function () {
    FB.login ( function ( response ) {
      if ( response.authResponse ) {

        scribble.helpers.xhr.get(
          scribble.helpers.routes.api_omniauth_login_url(
            'facebook',
            { signed_request: response.authResponse.signedRequest }
          )
        ,
          SessionStore._handleLoginResponse
        );
      }
    }, { scope: 'email' });
  },

  _loginWithGoogle: function () {
    gapi.auth.authorize(
      {
        response_type: 'code',
        cookie_policy: 'single_host_origin',
        client_id: '755459248039-vtj9q2g8h76sfpajljetsstb6fpevbcf.apps.googleusercontent.com',
        scope: 'email'
      }
    ,
      function(response) {
        if (response && !response.error) {
          scribble.helpers.xhr.get(
            scribble.helpers.routes.api_omniauth_login_url('google_oauth2', response),
            SessionStore._handleLoginResponse
          );
        } else {
          // google authentication failed
        }
      });
  },

  _loginWithEmail: function ( loginInfo ) {
    scribble.helpers.xhr.post(
      scribble.helpers.routes.api_signin_url(),
      { session: loginInfo },
      SessionStore._handleLoginResponse
    );
  },

  _createAndSigninWithEmail: function ( data ) {
    scribble.helpers.xhr.post(
      scribble.helpers.routes.api_users_url(),
      { user: data },
      SessionStore._handleLoginResponse
    );
  },

  _handleLoginResponse: function ( err, response ) {
    if ( err ) {
      alert("Well, that didn't work...try again?");
    } else if ( response.status === 200 ) {
      _currentUser = response.data.user;
      SessionStore.loginSuccess();
    } else if ( response.status === 400 ) {
      _userErrors = response.data.errors;
      SessionStore.emitChange();
    }
  }
}});

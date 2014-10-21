var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _currentUser;

function ensureCurrentUser () {
  if ( !SessionStore.currentUser() ) {
    scribble.router.navigate('/signin');
  }
}

function deleteSession () {
  scribble.helpers.xhr.request(
    'DELETE', 
    scribble.helpers.routes.api_signout_url(), 
    function ( err, response ) {
      if ( !err ) SessionStore.logoutSuccess();
    }
  )
}

function loginWithFb () {
  FB.login ( function ( response ) {
    if ( response.authResponse ) {

      scribble.helpers.xhr.get(
        scribble.helpers.routes.api_omniauth_login_url(
          'facebook',
          { signed_request: response.authResponse.signedRequest }
        )
      ,
        function ( err, response ) { 
          _currentUser = response.data.user;
          SessionStore.loginSuccess();
        }
      );
    }
  }, { scope: 'email' });
}

function loginWithGoogle () {
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
          function ( err, response ) {
            _currentUser = response.data.user;
            SessionStore.loginSuccess();
          }
        );
      } else {
        // google authentication failed
      }
    });
}

var SessionStore = React.addons.update(EventEmitter.prototype, {$merge: {

  initialize: function () {
    _currentUser = scribble.context.current_user.user;
    // don't expose session info globally
    scribble.context.current_user = null;
  },

  currentUser: function () {
    return _currentUser;
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
        ensureCurrentUser();
        break;
      case SessionConstants.FB_LOGIN:
        loginWithFb();
        break;
      case SessionConstants.GOOGLE_LOGIN:
        loginWithGoogle();
        break;
      case SessionConstants.LOGOUT:
        deleteSession();
        break;
    }

    return true;
  })
}});

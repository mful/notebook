var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _currentUser, _userErrors;

var SessionStore = React.addons.update(EventEmitter.prototype, {$merge: {

  initialize: function () {
    if ( this.initialized ) return true;

    if ( scribble_bootstrap.current_user ) {
      _currentUser = scribble_bootstrap.current_user.user;
    }

    // don't expose session info globally
    scribble_bootstrap.current_user = null;
    this.initialized = true;

    return this.initialized;
  },

  currentUser: function () {
    if ( !this.initialized ) this.initialize();
    return _currentUser;
  },

  // TODO: move to User store
  isCurrentUserComplete: function () {
    return _currentUser && _currentUser.username !== null && _currentUser.username.trim() !== ""
  },

  userErrors: function () {
    return _userErrors;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  loginSuccess: function () {
    if ( this.isCurrentUserComplete() ) {
      SessionActions.notifyLogin();
      CourierActions.postLogin( _currentUser );
    }
    this.emitChange();
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch(action.actionType) {
      case CourierConstants.POST_LOGIN:
        SessionStore._setCurrentUser( action.data.currentUser );
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
      // TODO: move to user Store
      case SessionConstants.CREATE_USER_WITH_EMAIL:
        SessionStore._createAndSigninWithEmail( action.data );
        break;
      // TODO: move to user Store
      case SessionConstants.UPDATE_CURRENT_USER:
        SessionStore._updateCurrentUser( action.data );
        break;
    }

    return true;
  }),

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
          // TODO: handle this
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
      errors = "- " + response.data.errors.join("\n- ");
      alert( "Whoops! There were some errors:\n\n" + errors );
    }
  },

  _setCurrentUser: function ( user ) {
    _currentUser = user;
    SessionActions.notifyLogin();
    SessionStore.emitChange();
  },

  // TODO: Move to User Store
  _updateCurrentUser: function ( data ) {
    scribble.helpers.xhr.request('POST',
      scribble.helpers.routes.api_user_url( _currentUser.id ),
      { user: data },
      function( err, response ) {
        if ( !err ) {
          if ( response.status == 200 ) {
            _currentUser = response.data.user;
            SessionStore.loginSuccess();
          } else {
            _userErrors = response.errors;
            SessionStore.emitChange();
            errors = "- " + response.data.errors.join("\n- ");
            alert( "Whoops! There were some errors:\n\n" + errors );
          }
        }
      }
    );
  }
}});

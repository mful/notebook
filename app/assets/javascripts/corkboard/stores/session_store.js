var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _currentUser;

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
    return !!_currentUser && _currentUser.username !== null && _currentUser.username.trim() !== ""
  },

  emitChange: function () {
    this.emit( CHANGE_EVENT );
  },

  addChangeListener: function ( callback ) {
    this.on( CHANGE_EVENT, callback );
  },

  removeChangeListener: function( callback ) {
    this.removeListener( CHANGE_EVENT, callback );
  },

  reset: function () {
    _currentUser = null;
  },

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch(action.actionType) {
      case SessionConstants.AUTH_NEEDED:
        SessionStore._ensureCurrentUser( 'popup' );
        break;
      case SessionConstants.LOGOUT:
        SessionStore._logout();
        break;
    }

    return true;
  }),

  _ensureCurrentUser: function ( referringAction ) {
    if ( !SessionStore.isCurrentUserComplete() ) {
      CorkboardCourier.post( SessionConstants.AUTH_NEEDED, {referringAction: referringAction} );
    }
  },

  _logout: function () {
    var _this = this;

    scribble.helpers.xhr.destroy(
      scribble.helpers.routes.api_signout_url(),
      function () {
        window.top.close();
      }
    );
  }
}});

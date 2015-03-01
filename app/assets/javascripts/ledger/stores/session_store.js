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
    return !!_currentUser && _currentUser.username !== null && _currentUser.username.trim() !== ""
  },

  userErrors: function () {
    return _userErrors;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  reset: function () {
    _currentUser = null;
  },

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch(action.actionType) {
      case AnnotationConstants.CREATE_WITH_COMMENT:
        SessionStore._ensureCurrentUser( 'add an annotation' );
        break;
      case CommentConstants.CREATE_COMMENT:
      case AnnotationConstants.ADD_COMMENT:
      case CommentConstants.ADD_REPLY:
        SessionStore._ensureCurrentUser( 'comment' );
        break;
      case CommentConstants.VOTE:
        SessionStore._ensureCurrentUser( 'vote' );
        break;
      case CourierConstants.POST_LOGIN:
        SessionStore._setCurrentUser( action.data.currentUser );
        break;
    }

    return true;
  }),

  _ensureCurrentUser: function ( referringAction ) {
    if ( !SessionStore.isCurrentUserComplete() ) {
      LedgerCourier.post( SessionConstants.AUTH_NEEDED, {referringAction: referringAction} );
    }
  },

  _setCurrentUser: function ( user ) {
    _currentUser = user;
    SessionActions.notifyLogin();
    SessionStore.emitChange();
  }
}});

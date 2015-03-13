var EventEmitter = require('event_emitter').EventEmitter,
    CHANGE_EVENT = 'change',
    _users = {},
    _atMentionUsers = [];

var UserStore = React.addons.update( EventEmitter.prototype, {$merge: {

  atMentionUsers: function () {
    return _atMentionUsers;
  },

  getNameMatches: function ( text ) {
    var users = [], _this = this;

    scribble.helpers.xhr.get(
      scribble.helpers.routes.api_users_by_mention_url({ text: text }),
      function ( err, response ) {
        if( !err && response.status === 200 ) {
          _atMentionUsers = response.data.users;
          _this.emitChange();
        }
      }
    );
  },

  // event methods

  addChangeListener: function ( callback ) {
    this.on( CHANGE_EVENT, callback );
  },

  removeChangeListener: function( callback ) {
    this.removeListener( CHANGE_EVENT, callback );
  },

  emitChange: function () {
    this.emit( CHANGE_EVENT );
  },

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch ( action.actionType ) {
      case UserConstants.AT_MENTION:
        UserStore.getNameMatches( action.data.text );
        break;
    }

    return true;
  })
}});

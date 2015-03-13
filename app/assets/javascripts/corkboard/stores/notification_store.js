var EventEmitter = require( 'event_emitter' ).EventEmitter;

var CHANGE_EVENT = 'change';
var _notifications = {};

var NotificationStore = React.addons.update( EventEmitter.prototype, {$merge: {

  // data manipulation

  initializeNotifications: function ( notifications ) {
    for ( var i = 0; i < notifications.length; i++ ) {
      _notifications[notifications[i].id] = notifications[i]
    }
  },

  toggleRead: function ( id ) {
    if ( !_notifications[id] ) return null;

    this._updateNotification( id, {read: !_notifications[id].read} );

    _notifications[id].read = !_notifications[id].read;
    this.emitChange();
  },

  // event handling

  emitChange: function () {
    this.emit( CHANGE_EVENT );
  },

  addChangeListener: function ( callback ) {
    this.on( CHANGE_EVENT, callback );
  },

  removeChangeListener: function ( callback ) {
    this.removeListener( CHANGE_EVENT, callback );
  },

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch ( action.actionType ) {
      case AppConstants.INITIALIZE_DATA:
        NotificationStore.initializeNotifications( action.data.notifications )
        break;
      case NotificationConstants.TOGGLE_READ:
        NotificationStore.toggleRead( action.data.id );
        break;
    }

    return true;
  }),

  _updateNotification: function ( id, data ) {
    var _this = this;

    scribble.helpers.xhr.post(
      scribble.helpers.routes.notification_url( id ),
      {notification: data},
      function ( err, response ) {
        if ( err ) return;

        _notifications[id] = response.notification;
        _this.emitChange();
      }
    );
  }
}});

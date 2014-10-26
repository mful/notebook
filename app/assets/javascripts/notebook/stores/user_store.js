var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';

var UserStore = React.addons.update(EventEmitter.prototype, {$merge: {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  dispatchToken: AppDispatcher.register(function ( payload ) {
    var action = payload.action;

    switch( action.actionType ) {

    }

    return true;
  })

  // private
}});

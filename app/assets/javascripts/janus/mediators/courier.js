var EventEmitter = require('event_emitter').EventEmitter;

var Courier = React.addons.update(EventEmitter.prototype, {$merge: {

  initialize: function () {
    this.receivePackage = this.receivePackage.bind( this );
    window.addEventListener( 'message', this.receivePackage, false );
  },

  post: function ( message, data ) {
    window.parent.postMessage(
      JSON.stringify({ message: message, data: data }),
      '*'
    );
  },

  receivePackage: function ( event ) {
    if (
      event.origin !== scribble.helpers.url.origin(document.referrer) ||
      event.data === "!_{h:''}"
    ) return;

    CourierActions.dispatch( JSON.parse(event.data) );
  },

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch( action.actionType ) {
      case CourierConstants.POST_LOGIN:
        Courier.post( CourierConstants.POST_LOGIN, action.data );
        break;
    }

    return true;
  })
}});

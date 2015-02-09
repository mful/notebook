var JanusCourier = React.addons.update(Courier, {$merge: {

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

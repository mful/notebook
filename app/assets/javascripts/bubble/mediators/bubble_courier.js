var BubbleCourier = React.addons.update(Courier, {$merge: {

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch( action.actionType ) {
      case CourierConstants.POST_LOGIN:
        Courier.post( SessionConstants.LOGIN_SUCCESS, action.data );
        break;
    }

    return true;
  })
}});

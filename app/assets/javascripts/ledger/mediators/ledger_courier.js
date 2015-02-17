var LedgerCourier = React.addons.update( Courier, {$merge: {

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch( action.actionType ) {
      case AnnotationConstants.ANNOTATION_CREATE_SUCCESS:
        LedgerCourier.post( CourierConstants.POST_CREATE_ANNOTATION, action.data );
        break;
    }

    return true;
  })
}});

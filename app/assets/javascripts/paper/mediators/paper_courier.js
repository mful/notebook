var PaperCourier = React.addons.update(Courier, {$merge: {

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch( action.actionType ) {
      case CommentConstants.COMMENT_CREATE_SUCCESS:
        PaperCourier.post( CourierConstants.POST_CREATE_COMMENT, action.data );
        break;
    }

    return true;
  })
}});

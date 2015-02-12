var CommentActions = {

  newReply: function ( commentId ) {
    RetortCourier.post( CommentConstants.NEW_REPLY, {comment_id: commentId} );
  }
}

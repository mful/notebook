var CommentActions = {

  newReply: function ( commentId ) {
    BubbleCourier.post( CommentConstants.NEW_REPLY, {comment_id: commentId} );
  },

  newComment: function ( annotationId ) {
    BubbleCourier.post( CommentConstants.NEW_COMMENT, {annotation_id: annotationId});
  },

  vote: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: CommentConstants.VOTE,
      data: data
    });
  }
}

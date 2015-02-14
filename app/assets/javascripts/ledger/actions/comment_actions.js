var CommentActions = {

  newReply: function ( commentId ) {
    // stub
  },

  newComment: function ( annotationId ) {
    // stub
  },

  showReplies: function ( commentId ) {
    // stub
  },

  vote: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: CommentConstants.VOTE,
      data: data
    });
  }
}

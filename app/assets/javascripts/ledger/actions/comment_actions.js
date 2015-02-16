var CommentActions = {

  createComment: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: CommentConstants.CREATE_COMMENT,
      data: data
    });
  },

  createReply: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: CommentConstants.ADD_REPLY,
      data: data
    });
  },

  vote: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: CommentConstants.VOTE,
      data: data
    });
  }
}

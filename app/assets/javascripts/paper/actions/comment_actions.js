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

  notifyCreate: function ( comment ) {
    AppDispatcher.handleStoreRequest({
      actionType: CommentConstants.COMMENT_CREATE_SUCCESS,
      data: {comment: comment}
    })
  }
};

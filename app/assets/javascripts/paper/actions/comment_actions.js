var CommentActions = {
  createComment: function ( data ) {
    AppDispatcher.handleStoreRequest({
      actionType: CommentConstants.CREATE_COMMENT,
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
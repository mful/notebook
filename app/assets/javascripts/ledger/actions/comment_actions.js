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

  newReply: function ( id ) {
    AppDispatcher.handleViewAction({
      actionType: RouterConstants.NAVIGATE,
      data: {
        path: scribble.helpers.routes.comment_path(
          id, {formVisibility: 'open'}
        )
      }
    })
  },

  notifyCreate: function ( comment ) {
    AppDispatcher.handleStoreRequest({
      actionType: CommentConstants.COMMENT_CREATE_SUCCESS,
      data: {comment: comment}
    })
  },

  showReplies: function ( id ) {
    AppDispatcher.handleViewAction({
      actionType: RouterConstants.NAVIGATE,
      data: {path: scribble.helpers.routes.comment_path( id )}
    })
  },

  vote: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: CommentConstants.VOTE,
      data: data
    });
  }
}

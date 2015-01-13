var CommentActions = {

  addReply: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: CommentConstants.ADD_REPLY,
      data: data
    });
  }
}

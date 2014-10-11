var AnnotationActions = {

  createWithComment: function( data ) {
    AppDispatcher.handleViewAction({
      actionType: AnnotationConstants.CREATE_WITH_COMMENT,
      data: data
    });
  },

  addComment: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: AnnotationConstants.ADD_COMMENT,
      data: data
    });
  },

  notifyComments: function ( comments ) {
    AppDispatcher.handleStoreRequest({
      actionType: AnnotationConstants.NOTIFY_COMMENTS,
      data: comments      
    });
  }
}

var AnnotationActions = {

  addComment: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: AnnotationConstants.ADD_COMMENT,
      data: data
    });
  },

  createWithComment: function( data ) {
    AppDispatcher.handleViewAction({
      actionType: AnnotationConstants.CREATE_WITH_COMMENT,
      data: data
    });
  },

  newAnnotation: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: AnnotationConstants.NEW_ANNOTATION,
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

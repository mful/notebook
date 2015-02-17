var AnnotationActions = {

  createWithComment: function( data ) {
    AppDispatcher.handleViewAction({
      actionType: AnnotationConstants.CREATE_WITH_COMMENT,
      data: data
    });
  },

  notifyComments: function ( comments ) {
    AppDispatcher.handleStoreRequest({
      actionType: AnnotationConstants.NOTIFY_COMMENTS,
      data: comments
    });
  },

  notifyCreate: function ( annotation ) {
    AppDispatcher.handleStoreRequest({
      actionType: AnnotationConstants.ANNOTATION_CREATE_SUCCESS,
      data: {annotation: annotation}
    });
  },

  showAnnotation: function ( id ) {
    AppDispatcher.handleStoreRequest({
      actionType: RouterConstants.NAVIGATE,
      data: {path: scribble.helpers.routes.annotation_path( id )}
    });
  }
}

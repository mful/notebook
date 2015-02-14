var AnalyticsActions = {

  trackAddAnnotation: function () {
    scribble.helpers.analytics.trackGoogleEvent(
      AnalyticsConstants.ADD_ANNOTATION,
      'Annotation Bubble',
      false
    );
  },

  trackAnnotationView: function ( annotation, commentCount ) {
    scribble.helpers.analytics.trackGoogleEvent(
      AnalyticsConstants.VIEW_ANNOTATION,
      annotation.url,
      commentCount
    );
  },

  trackViewReplies: function ( comment ) {
    scribble.helpers.analytics.trackGoogleEvent(
      AnalyticsConstants.VIEW_REPLIES,
      comment.id,
      comment.reply_count
    )
  }
};

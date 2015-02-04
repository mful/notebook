var AnalyticsActions = {

  trackAnnotationView: function ( annotation, commentCount ) {
    scribble.helpers.analytics.trackGoogleEvent(
      AnalyticsConstants.VIEW_ANNOTATION,
      annotation.url,
      commentCount
    );
  }
};

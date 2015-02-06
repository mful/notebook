var AnalyticsActions = {

  trackAuthStart: function ( referringAction ) {
    scribble.helpers.analytics.trackGoogleEvent(
      AnalyticsConstants.AUTH_START,
      referringAction
    );
  }
};

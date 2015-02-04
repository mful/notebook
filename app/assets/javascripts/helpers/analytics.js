scribble.helpers || ( scribble.helpers = {} );
scribble.helpers.analytics = {};

// TODO: move to store?
( function ( namespace ) {

  namespace.trackGoogleEvent = function ( category, action, label, value ) {
    var currentUser = SessionStore.currentUser() ? SessionStore.currentUser() : {};

    if (typeof ga !== "undefined" && ga !== null) {
      return ga('send', 'event', category, action, label, value, {
        'metric1': currentUser.id
      });
    }
  };

})( scribble.helpers.analytics );

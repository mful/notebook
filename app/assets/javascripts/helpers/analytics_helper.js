scribble.helpers || (scribble.helpers = {});
scribble.helpers.analytics = {};

(function(namespace) {

  namespace.trackGoogleEvent = function(category, action, label, value) {
    if (label == null) {
      label = null;
    }
    if (value == null) {
      value = null;
    }
    if (typeof ga !== "undefined" && ga !== null) {
      return ga('send', 'event', category, action, label, value);
    }
  };

})(scribble.helpers.analytics);

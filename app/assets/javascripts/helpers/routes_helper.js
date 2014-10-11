scribble.helpers || (scribble.helpers = {});
scribble.helpers.routes = {};

(function (namespace) {

  namespace.api_annotations_url = function() {
    return urlRoot() + '/api/annotations';
  };

  namespace.api_comments_url = function() {
    return urlRoot() + '/api/comments';
  };

  urlRoot = function () {
    if (scribble.context.env === 'production') {
      return 'http://scribble.ly';
    } else {
      return 'http://scribble.dev:3000';
    }
  };

})(scribble.helpers.routes);

scribble.helpers || (scribble.helpers = {});
scribble.helpers.routes = {};

(function (namespace) {

  var _urlRoot;

  namespace.api_annotations_url = function () {
    return urlRoot() + '/api/annotations';
  };

  namespace.api_comments_url = function () {
    return urlRoot() + '/api/comments';
  };

  namespace.api_omniauth_login_url = function ( provider, options ) {
    var query = queryString( options );
    return urlRoot() + '/auth/' + provider + '/callback' + query;
  };

  namespace.api_signout_url = function () {
    return urlRoot() + '/api/signout';
  };

  var urlRoot = function () {
    if ( _urlRoot == null ) {
      if (scribble.context.env === 'production') {
        _urlRoot = 'http://scribble.ly';
      } else {
        _urlRoot = 'http://scribble.dev:3000';
      }
    }

    return _urlRoot;
  };

  var queryString = function ( params ) {
    var query = '';

    if ( params != null && !_(params).isEmpty() ) {
      query = '?';
      for ( key in params ) {
        query += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
      }
    }

    return query.substring(0, query.length - 1);
  };

})(scribble.helpers.routes);

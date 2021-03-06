scribble.helpers || (scribble.helpers = {});
scribble.helpers.routes = {};

( function ( namespace ) {

  var _urlRoot;

  namespace.api_annotation_url = function ( id ) {
    return urlRoot() + '/api/annotations/' + id;
  };

  namespace.api_annotations_url = function () {
    return urlRoot() + '/api/annotations';
  };

  namespace.api_users_by_mention_url = function ( params ) {
    params || ( params = {} );
    return urlRoot() + '/api/users/by_mention' + queryString( params );
  };

  namespace.api_comments_url = function () {
    return urlRoot() + '/api/comments';
  };

  namespace.api_comment_replies_url = function ( id ) {
    return urlRoot() + '/api/comments/' + id + '/replies';
  };

  namespace.api_comment_votes_url = function ( id ) {
    return urlRoot() + '/api/comments/' + id + '/votes';
  };

  namespace.api_omniauth_login_url = function ( provider, options ) {
    var query = queryString( options );
    return urlRoot() + '/auth/' + provider + '/callback' + query;
  };

  namespace.api_signout_url = function () {
    return urlRoot() + '/api/signout';
  };

  namespace.api_signin_url = function () {
    return urlRoot() + '/api/sessions';
  };

  namespace.api_users_url = function () {
    return urlRoot() + '/api/users';
  };

  namespace.api_user_url = function ( id ) {
    return urlRoot() + '/api/users/' + id;
  };

  namespace.annotation_path = function ( id ) {
    return '/annotations/' + id;
  };

  namespace.comment_path = function ( id, options ) {
    options || ( options = {} );
    return '/comments/' + id + queryString( options );
  };

  namespace.notification_url = function ( id ) {
    return urlRoot() + '/api/notifications/' + id;
  };

  namespace.privacy_policy_url = function () {
    return urlRoot() + '/privacy';
  };

  namespace.signin_path = function ( params ) {
    return '/signin' + queryString( params );
  };

  var urlRoot = function () {
    if ( _urlRoot == null ) {
      if ( scribble_bootstrap.env === 'production' ) {
        _urlRoot = 'https://scribblely.herokuapp.com';
      } else if ( scribble_bootstrap.env === 'development' ) {
        _urlRoot = 'http://scribble.dev:3000';
      } else {
        _urlRoot = 'http://' + document.location.host;
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

})( scribble.helpers.routes );

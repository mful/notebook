scribble.helpers || (scribble.helpers = {});
scribble.helpers.url = {};

(function ( namespace ) {

  namespace.queryObject = function () {
    var params = {};
    var queryString = window.location.search.substring(1); 
    var queryParams = queryString.split('&');

    for ( param in queryParams ) {
      var paramPair, key, value;

      paramPair = queryParams[param].split('=');
      key = decodeURIComponent( paramPair[0] );
      value = decodeURIComponent( paramPair[1] );

      params[key] = value;
    }

    return params;
  };

  namespace.parse = function ( urlString ) {
    var parser = document.createElement('a');
    parser.href = urlString;

    return parser;
  };
})( scribble.helpers.url );

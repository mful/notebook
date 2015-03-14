scribble.helpers || (scribble.helpers = {});
scribble.helpers.xhr = {};

(function (namespace) {
  var _csrfHeaders;

  namespace.request = function (type, url, opts, callback) {
    var xhr = new XMLHttpRequest(),
        csrfHeaders = getCSRFHeaders(),
        pd;

    xhr.withCredentials = true;

    if (typeof opts === 'function') {
      callback = opts;
      opts = null;
    }

    xhr.open(type, url);

    xhr.setRequestHeader("X-CSRF-Param", csrfHeaders.param);
    xhr.setRequestHeader("X-CSRF-Token", csrfHeaders.token);

    if (type === 'POST' && opts) {
      if ( opts.authenticity_token == null ) opts.authenticity_token = csrfHeaders.token;
      pd = JSON.stringify(opts);
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onload = function () {
      setCSRFHeaders( xhr );
      var res = {data: JSON.parse(xhr.response), status: xhr.status};
      return callback.call(xhr, null, res);
    };

    xhr.onerror = function () {
      return callback.call(xhr, true);
    };

    xhr.send(opts ? pd : null);

    return xhr;
  };

  function setCSRFHeaders ( xhr ) {
    var csrf_param = xhr.getResponseHeader('X-CSRF-Param');
    var csrf_token = xhr.getResponseHeader('X-CSRF-Token');

    if (csrf_param) {
      _csrfHeaders.param = csrf_param;
    }
    if (csrf_token) {
      _csrfHeaders.token = csrf_token;
    }
  }

  function getCSRFHeaders () {
    if ( _csrfHeaders != null ) return _csrfHeaders;
    var token, param;

    _csrfHeaders = {};
    token = document.querySelector("meta[name='csrf-token']");
    param = document.querySelector("meta[name='csrf-param']");

    if ( token ) _csrfHeaders.token = token.content;
    if ( param ) _csrfHeaders.param = param.content;

    return _csrfHeaders;
  }

  namespace.get = namespace.request.bind(this, 'GET');
  namespace.post = namespace.request.bind(this, 'POST');
  namespace.destroy = namespace.request.bind(this, 'DELETE');

})(scribble.helpers.xhr);

var URI = require('uri').URI;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

var escapeRegExp, namedParam, splatParam;

namedParam = /:\w+/g;

splatParam = /\*\w+/g;

escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

Router.prototype.initialRoute = true;

Router.prototype.notFoundUrl = "" + window.location.protocol + "//" + window.location.host + "/404";

function Router(options) {
  this.toHref = __bind(this.toHref, this);
  this._parseRouteParameters = __bind(this._parseRouteParameters, this);
  this._routeParameters = __bind(this._routeParameters, this);
  this.beforeParameters = __bind(this.beforeParameters, this);
  this._overrideQueryParameters = __bind(this._overrideQueryParameters, this);
  this._routeFromPath = __bind(this._routeFromPath, this);
  this._findRoute = __bind(this._findRoute, this);
  this.renderRoute = __bind(this.renderRoute, this);
  this._navigate = __bind(this._navigate, this);
  this._initializeHistory = __bind(this._initializeHistory, this);
  this._pathToRegExp = __bind(this._pathToRegExp, this);
  this._initializeRoutes = __bind(this._initializeRoutes, this);
  this.redirect = __bind(this.redirect, this);
  this.getStateData = __bind(this.getStateData, this);
  this.currentRoute = __bind(this.currentRoute, this);
  this.uri = __bind(this.uri, this);
  this.replaceStateData = __bind(this.replaceStateData, this);
  this.back = __bind(this.back, this);
  this.hasBack = __bind(this.hasBack, this);
  this.navigate = __bind(this.navigate, this);
  this.start = __bind(this.start, this);
  this.historyCounter = -1;
  this.currentRoutingId = 0;
  this.initialRoute = true;
  this.previousUrl = '$initial';
  this._initializeRoutes();
  this._initializeHistory();
  this.initialize(options);
}


/* for overriding */

Router.prototype.initialize = function() {};

Router.prototype.afterStart = function() {};

/* public methods */

Router.prototype.start = function() {
  this.historyCounter = 1;
  return this._navigate(location.href, {
    replace: true
  });
};

Router.prototype.navigate = function(url, options) {
  this.initialRoute = false;
  this.previousUrl = document.location.href;
  return this._navigate(url, options);
};

Router.prototype.hasBack = function() {
  return this.historyCounter > 1;
};

Router.prototype.back = function() {
  if (this.hasBack()) {
    this.previousUrl = document.location.href;
    this.historyCounter -= 1;
    return history.back();
  }
};

Router.prototype.replaceStateData = function(data) {
  this.replacingStateData = true;
  history.replaceState(data, document.title, location.href);
  return this.replacingStateData = false;
};

Router.prototype.uri = function() {
  return new URI(location.href);
};

Router.prototype.currentRoute = function() {
  var uri;
  uri = this.uri();
  return "" + (uri.path()) + (uri.search());
};

Router.prototype.currentPathname = function() {
  return window.location.pathname;
};

Router.prototype.currentHref = function() {
  return window.location.href;
};

Router.prototype.getStateData = function() {
  return history.state;
};


/* public route helpers */

Router.prototype.redirect = function(path) {
  return this.navigate(path);
};


/* initialization helpers */

Router.prototype._initializeRoutes = function() {
  return this.routes = _.map(this.routes, (function(_this) {
    return function(callbacks, path) {
      var route;
      route = {
        path: _this._pathToRegExp(path)
      };
      if (_.isString(callbacks)) {
        route.render = _this[callbacks];
      } else if (_.isObject(callbacks)) {
        route.before = _this[callbacks.before];
        route.render = _this[callbacks.render];
      }
      return route;
    };
  })(this));
};

Router.prototype._pathToRegExp = function(path) {
  path = path.replace(escapeRegExp, '\\$&').replace(namedParam, '([^\/]+)').replace(splatParam, '(.*?)');
  return new RegExp('^' + path + '$');
};

Router.prototype._initializeHistory = function() {
  return scribbleHistory.bindPopstate(this.renderRoute);
};


/* routing helpers */

Router.prototype._navigate = function(url, options) {
  var href, replaceState, result, route, trigger;
  if (options == null) {
    options = {};
  }
  replaceState = options.replace;
  trigger = options.trigger != null ? options.trigger : true;
  href = this.toHref(url);
  route = this._findRoute(href);
  if (route.before != null) {
    result = route.before({
      data: null,
      title: document.title,
      url: url,
      params: this._routeParameters(route)
    });
    if (result.redirect) {
      return;
    }
  }
  if (replaceState || location.href === href) {
    history.replaceState(null, document.title, href);
  } else {
    history.pushState(null, document.title, href);
    this.historyCounter += 1;
    scribbleHistory.everPushedState = true;
  }
  if (trigger) {
    return this.renderRoute();
  }
};

Router.prototype.renderRoute = function() {
  var parameters, route, triggerRenderedError, triggerRenderedSuccess;
  this.currentRoutingId += 1;
  if (this.replacingStateData || this.replacingStateQueryParameter) {
    return;
  }
  route = this._findRoute(location.href);
  parameters = this._routeParameters(route);
  return route.render.apply(this, parameters);
};

Router.prototype._findRoute = function(path) {
  var routeData;
  routeData = this._routeFromPath(path);
  if (!routeData.route) {
    routeData = this._routeFromPath(this.notFoundUrl);
  }
  return this._routeObject(routeData);
};

Router.prototype._routeFromPath = function(path) {
  var route, uri;
  uri = new URI(path).normalize();
  path = uri.path().replace(/^\/|\/$/g, '');
  route = _.find(this.routes, (function(_this) {
    return function(route) {
      return route.path.test(path);
    };
  })(this));
  return {
    route: route,
    path: path,
    uri: uri
  };
};

Router.prototype._routeObject = function(options) {
  return {
    regex: options.route.path,
    path: options.path,
    before: options.route.before,
    getState: options.route.getState,
    render: options.route.render,
    uri: options.uri
  };
};

Router.prototype._overrideQueryParameters = function(route) {
  var search, uri;
  uri = route.uri;
  search = this.overrideQueryParameters(uri.search(true));
  return uri.search(search);
};

Router.prototype.beforeParameters = function(route) {
  var parameters;
  parameters = this._parseRouteParameters(route);
  parameters.push(route.uri.search(true));
  parameters.unshift(route.path);
  return parameters;
};

Router.prototype._routeParameters = function(route) {
  var parameters;
  parameters = this._parseRouteParameters(route);
  parameters.push(route.uri.search(true));
  return parameters;
};

Router.prototype._parseRouteParameters = function(route) {
  var path;
  path = route.uri.path().replace(/^\/|\/$/g, '');
  return route.regex.exec(path).slice(1);
};

Router.prototype.toHref = function(string) {
  return new URI(string).absoluteTo(location.href).href();
};

module.exports = Router;
Router.Router = Router;

var scribbleHistory = new (function () {
  popstateFired = false;
  initialUrl = location.href;

  everPushedState: false;

  var popHandler = function () {
    window.onload = function () {
      setTimeout(function() { popstateFired = true; }, 0);
    }

    window.onpopstate = function ( _this ) {
      return function ( event ) {
        if ( !popstateFired ) {
          popstateFired = true;
          if ( !_this.everPushedState && location.href === initialUrl ) {
            return;
          }
        }

        if ( !_this.onpopstate ) {
          _this.onpopstate( event );
        }
      }
    }(this);
  };

  popHandler.prototype.bindPopstate = function( callback ) {
    this.onpopstate = callback;
  }

  return popHandler;
}());

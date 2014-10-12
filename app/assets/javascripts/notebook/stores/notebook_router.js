var Router = require('router').Router;

var NotebookRouter = React.addons.update(Router.prototype, {$merge: {
  routes: {
    '/login' : 'login'
  },

  login: function () {
    alert('login!');
  }
}});

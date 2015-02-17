/** @jsx React.DOM */

var __hasProp = {}.hasOwnProperty,
  __extends = function ( child, parent ) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

var Router = require('router');

var LedgerRouter = ( function ( _super ) {
  __extends( LedgerRouter, _super );

  function LedgerRouter () {
    return LedgerRouter.__super__.constructor.apply( this, arguments );
  }

  LedgerRouter.prototype.initialize = function () {
    this.appContainer = document.getElementById('content');
    this.start();
  };

  LedgerRouter.prototype.routes = {
    'annotations/new' : 'newAnnotation',
    'annotations/:id' : 'showAnnotation',
    'comments/:id' : 'showComment'
  };

  LedgerRouter.prototype.newAnnotation = function () {};

  LedgerRouter.prototype.showAnnotation = function () {
    var _this = this, annotation, comments;


    AnnotationStore.getById( arguments[0], function ( annotation ) {
      comments = CommentStore.getByAnnotationAsList( annotation.id )

      _this.changePage( <AnnotationPage annotation={ annotation }
                                        comments={ comments }
                                        server_rendered={ false }
                                        logo={ scribble_bootstrap.logo } /> );
    });
  };

  LedgerRouter.prototype.showComment = function ( id, queryStr ) {
    var _this = this,
        params = scribble.helpers.url.queryObject(),
        comment, replies;

    CommentStore.getById( id, function ( obj ) {
      comment = obj;

      CommentStore.getReplies( comment.id, function ( replies ) {

        _this.changePage( <CommentPage comment={ comment }
                                       replies={ replies }
                                       server_rendered={ false }
                                       formVisibility={ params.formVisibility } />)
      });
    });

  };

  LedgerRouter.prototype.changePage = function ( component ) {
    React.renderComponent(
      component,
      this.appContainer
    );

    window.scroll( 0, 0);
  };

  LedgerRouter.prototype.dispatchToken = AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    switch ( action.actionType ) {
      case RouterConstants.NAVIGATE:
        ledger.router.navigate( action.data.path );
        break;
    }

    return true;
  });

  return LedgerRouter;

})( Router );

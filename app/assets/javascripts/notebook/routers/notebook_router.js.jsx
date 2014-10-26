/** @jsx React.DOM */

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

var Router = require('router').Router;

var NotebookRouter = (function ( _super ) {
  __extends(NotebookRouter, _super);

  function NotebookRouter () {
    return NotebookRouter.__super__.constructor.apply(this, arguments);
  }

  NotebookRouter.prototype.initialize = function () {
    this.appContainer = document.getElementById('content');
  };

  NotebookRouter.prototype.routes = {
    'signin' : 'signin',
    'annotations/new' : 'newAnnotation',
    'annotations/:id' : 'showAnnotation'
  };

  NotebookRouter.prototype.signin = function () {
    this.openModal( <LoginForm /> );
  };

  NotebookRouter.prototype.newAnnotation = function () {
    this.changePage( <DiscussionBox /> );
  };

  NotebookRouter.prototype.showAnnotation = function () {
    var data = {
      annotation: AnnotationStore.getById(arguments[0]),
      comments: CommentStore.getAllAsList()
    };
    this.changePage( <DiscussionBox data={ data } /> );
  };

  NotebookRouter.prototype.changePage = function ( component ) {
    if ( this.initialRoute ) return;
    this.closeModal();

    React.renderComponent(
      component,
      this.appContainer
    );
  };

  NotebookRouter.prototype.openModal = function ( component ) {
    if  ( this.modal == null ) {
      this.modal = document.getElementById('scribble-modal-container');
    }

    React.renderComponent(
      <Modal component={ component } />,
      this.modal
    );
    this.modal.className += ' active';
  };

  NotebookRouter.prototype.closeModal = function () {
    if ( !this.modal ) return;

    var newClassName = this.modal.className.replace( /(?:^|\s)active(?!\S)/g , '' );
    React.unmountComponentAtNode(this.modal);
    this.modal.className = newClassName;
  };

  NotebookRouter.prototype.dispatchToken = AppDispatcher.register ( function ( payload ) {
    var action = payload.action;

    switch ( action.actionType ) {
      case SessionConstants.LOGIN_SUCCESS:
      case ModalConstants.CLOSE_MODAL:
        scribble.router.closeModal();
        break;
    }

    return true
  });

  return NotebookRouter;

})(Router);

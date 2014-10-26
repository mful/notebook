var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _annotations = {};
var _pendingAnnotation;

var AnnotationStore = React.addons.update(EventEmitter.prototype, {$merge: {
  
  handleCreateResponse: function ( err, response ) {
    if ( err ) {
      alert('Whoops! Something went wrong. Try again?'); 
    } else if ( response.status === 200 ) {
      _pendingAnnotation = null;
      AnnotationStore.separateComments( response.data );
      AnnotationStore.emitChange();
      scribble.router.navigate( '/annotations/' + response.data.annotation.id );
    } else if ( response.status === 403 ) {
      scribble.router.navigate('/login');
    } else if ( response.status === 400 ) {
      alert( 'Invalid data!' )
    } else {
      alert( 'Well, this is embarassing. There was an error. Try again?' );
    }
  },

  getAll: function() {
    return _annotations;
  },

  getFirst: function () {
    for ( var id in _annotations ) {
      return _annotations[id];
    }
  },

  getById: function ( id ) {
    return _annotations[id];
  },

  reset: function () {
    return _annotations = {};
  },

  separateComments: function ( data ) {
    var comments = data.annotation.comments.slice();
    delete data.annotation.comments
    _annotations[data.annotation.id] = data.annotation;

    AnnotationActions.notifyComments(comments);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatchToken: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case AnnotationConstants.CREATE_WITH_COMMENT:
        AppDispatcher.waitFor([SessionStore.dispatchToken])
        AnnotationStore._handleCreateWithComment(action.data);
        break;
      case SessionConstants.LOGIN_SUCCESS:
        AnnotationStore._flushPendingAnnotation();
        break;
    }

    return true;
  }),

  // private

  _handleCreateWithComment: function ( data ) {
    _pendingAnnotation = data;

    if ( SessionStore.currentUser() ) {
      this._createWithComment(_pendingAnnotation);
    }
  },

  _flushPendingAnnotation: function () {
    if ( _pendingAnnotation !== null ) {
      this._createWithComment(_pendingAnnotation);
    }
  },

  _createWithComment: function ( data ) {
   scribble.helpers.xhr.post(
      scribble.helpers.routes.api_annotations_url(),
      data,
      AnnotationStore.handleCreateResponse
    );
  }
}});

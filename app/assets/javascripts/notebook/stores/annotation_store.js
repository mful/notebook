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
      scribble.router.navigate(
        scribble.helpers.routes.annotation_path( response.data.annotation.id )
      );
    } else if ( response.status === 403 ) {
      scribble.router.navigate('/login');
    } else if ( response.status === 400 ) {
      alert( 'Invalid data!' )
      // TODO: add flash handling here
    } else {
      alert( 'Well, this is embarassing. There was an error. Try again?' );
    }
  },

  getAll: function() {
    return _annotations;
  },

  getFirst: function () {
    if ( Object.keys( _annotations ).length === 0 ) return this.getPending();

    for ( var key in _annotations ) {
      return _annotations[key];
    }
  },

  getById: function ( id, callback ) {
    if ( _annotations[id] ) return _annotations[id];

    scribble.helpers.xhr.get(
      scribble.helpers.routes.api_annotation_url( id ),
      function ( err, response ) {
        if ( err ) {
          alert('Whoops! Something went wrong. Try again?');
        } else if ( response.status === 200 ) {
          AnnotationStore.separateComments( response.data );
          _annotations[id] = response.data.annotation;
          callback( _annotations[id] );
        } else if ( response.status === 404 ) {
          // stub
        }
      }
    )
  },

  getPending: function () {
    return _pendingAnnotation;
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
        AppDispatcher.waitFor([scribble.router.dispatchToken])
        AnnotationStore._flushPendingAnnotation();
        break;
      case AnnotationConstants.NEW_ANNOTATION:
        _pendingAnnotation = action.data;
        AnnotationStore.emitChange();
        break;
    }

    return true;
  }),

  // private

  _handleCreateWithComment: function ( data ) {
    _pendingAnnotation = data;

    if ( SessionStore.isCurrentUserComplete() ) {
      this._createWithComment(_pendingAnnotation);
    }
  },

  _flushPendingAnnotation: function () {
    if ( _pendingAnnotation != null ) {
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

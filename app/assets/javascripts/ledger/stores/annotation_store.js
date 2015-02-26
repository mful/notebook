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
      AnnotationActions.notifyCreate( response.data.annotation );
      AnnotationActions.showAnnotation( response.data.annotation.id );
    } else if ( response.status === 400 ) {
      errors = "- " + response.data.errors.join("\n- ");
      alert( "Whoops! There were some errors:\n\n" + errors );
    }
  },

  getAll: function() {
    return _annotations;
  },

  getById: function ( id, callback ) {
    if ( _annotations[id] ) return callback( _annotations[id] );

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
    );
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
        AnnotationStore._handleCreateWithComment(action.data);
        break;
      case AppConstants.INITIALIZE_DATA:
        AnnotationStore._initializeAnnotations( action.data )
        break;
      case SessionConstants.LOGIN_SUCCESS:
        AnnotationStore._flushPendingAnnotation();
        break;
    }

    return true;
  }),

  // private

  _createWithComment: function ( data ) {
    scribble.helpers.xhr.post(
      scribble.helpers.routes.api_annotations_url(),
      data,
      AnnotationStore.handleCreateResponse
    );
  },

  _flushPendingAnnotation: function () {
    if ( _pendingAnnotation != null ) {
      this._createWithComment(_pendingAnnotation);
      _pendingAnnotation = null;
    }
  },

  _handleCreateWithComment: function ( data ) {
    _pendingAnnotation = data;

    if ( SessionStore.isCurrentUserComplete() ) {
      this._createWithComment( _pendingAnnotation );
    }
  },

  _initializeAnnotations: function ( data ) {
    if ( data.annotations ) {
      for ( var i = 0; i < data.annotations.length; i++ ) {
        _annotations[data.annotations[i].id] = data.annotations[i];
      }
    }

    return _annotations;
  },
}});

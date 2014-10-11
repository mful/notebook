var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _annotations = {};

function createWithComment( data ) {
 scribble.helpers.xhr.post(
    scribble.helpers.routes.api_annotations_url(),
    data,
    AnnotationStore.handleCreateResponse
  );
}

var AnnotationStore = React.addons.update(EventEmitter.prototype, {$merge: {
  
  handleCreateResponse: function ( err, response ) {
    if ( err ) {
      alert('Whoops! Something went wrong. Try again?'); 
    } else if ( response.status === 200 ) {
      AnnotationStore.reset();
      AnnotationStore.separateComments(response.data);
      AnnotationStore.emitChange();
    } else if ( response.status === 403 ) {
      // handle login
      alert( 'Login!' );
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

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var text;

    switch(action.actionType) {
      case AnnotationConstants.CREATE_WITH_COMMENT:
        createWithComment(action.data);
        break;
    }

    return true;
  })
}});

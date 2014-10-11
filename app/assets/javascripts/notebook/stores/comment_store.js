var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _comments = {};

function setComments ( comments ) {
  CommentStore.reset();
  for ( var i in comments ) {
    var comment = comments[i]
    _comments[comment.id] = comment
  }

  CommentStore.emitChange();
}

function createComment ( data ) {
  scribble.helpers.xhr.post(
    scribble.helpers.routes.api_comments_url(),
    data,
    CommentStore.handleCreateResponse
  );
}

var CommentStore = React.addons.update(EventEmitter.prototype, {$merge: {
  
  handleCreateResponse: function ( err, response ) {
    var comment = response.data.comment;
    _comments[comment.id] = comment;
    CommentStore.emitChange();
  },

  getAll: function() {
    return _comments;
  },

  getAllAsList: function () {
    var commentsList = [];
    for ( var key in _comments ) {
      commentsList.push(_comments[key]);
    }
    return commentsList;
  },

  reset: function () {
    return _comments = {};
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
      case AnnotationConstants.NOTIFY_COMMENTS:
        setComments(action.data);
        break;
      case AnnotationConstants.ADD_COMMENT:
        createComment(action.data);
        break;
    }

    return true;
  })
}});

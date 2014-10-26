var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _comments = {};
var _pendingComment;

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
      commentsList.push( _comments[key] );
    }
    return commentsList;
  },

  reset: function () {
    return _comments = {};
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
    var text;

    switch ( action.actionType ) {
      case AnnotationConstants.NOTIFY_COMMENTS:
        CommentStore._setComments(action.data);
        break;
      case AnnotationConstants.ADD_COMMENT:
        CommentStore._handleCreateComment(action.data);
        break;
      case SessionConstants.LOGIN_SUCCESS:
        CommentStore._flushComment();
        break;
    }

    return true;
  }),

  // private

  _handleCreateComment: function ( data ) {
    _pendingComment = data;

    if ( SessionStore.currentUser() ) {
      this._createComment( _pendingComment );
    }
  },

  _flushComment: function () {
    if ( _pendingComment !== null ) {
      this._createComment ( _pendingComment )
    }
  },

  _setComments: function ( comments ) {
    CommentStore.reset();
    for ( var i in comments ) {
      var comment = comments[i]
      _comments[comment.id] = comment
    }

    CommentStore.emitChange();
  },

  _createComment: function ( data ) {
    scribble.helpers.xhr.post(
      scribble.helpers.routes.api_comments_url(),
      data,
      CommentStore.handleCreateResponse
    );
  }
}});

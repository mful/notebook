var EventEmitter = require('event_emitter').EventEmitter;

var CHANGE_EVENT = 'change';
var _comments = {};
var _pendingComment, _pendingReply, _pendingVote;

var CommentStore = React.addons.update(EventEmitter.prototype, {$merge: {

  handleCreateResponse: function ( err, response ) {
    var comment, errors;

    if ( err ) {
      alert("Well, that didn't work...try again?");
      return;
    } else if ( response.status === 200 ) {
      comment = response.data.comment;
      _comments[comment.id] = comment;
      _pendingComment = null;
    } else if ( response.status === 400 ) {
      errors = "- " + response.data.errors.join("\n- ");
      alert( "Whoops! There were some errors:\n\n" + errors );
    }

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
    return this.sortByRating( commentsList );
  },

  getByAnnotationAsList: function ( id ) {
    var comments = []

    for ( var key in _comments ) {
      if ( _comments[key].annotation_id === id )
        comments.push( _comments[key] );
    }

    return this.sortByRating( comments );
  },

  getById: function ( id, callback ) {
    if ( !callback ) return _comments[id];

    return callback( _comments[id] );
  },

  getPending: function () {
    return _pendingComment;
  },

  getReplies: function ( id, callback ) {
    var replies = _( _comments ).where({ parent_comment_id: id });

    if ( !callback ) return replies;
    if ( replies && replies.length > 0 ) return callback( replies );

    scribble.helpers.xhr.get(
      scribble.helpers.routes.api_comment_replies_url( id ),
      function ( err, response ) {
        if ( err ) {
          alert('Whoops! Something went wrong. Try again?');
        } else if ( response.status === 200 ) {
          replies = response.data.comments;
          for ( var i = 0; i < replies.length; i++ ) {
            _comments[replies[i].id] = replies[i];
          }

          callback( replies );
        }
      }
    );
  },

  sortByRating: function ( comments ) {
    return _( comments ).sortBy( function ( comment ) { return -1 * comment.rating; } );
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
      // keep
      case AnnotationConstants.NOTIFY_COMMENTS:
        CommentStore._setComments( action.data );
        break;
      case CommentConstants.CREATE_COMMENT:
      case AnnotationConstants.ADD_COMMENT:
        CommentStore._handleCreateComment( action.data );
        break;
      case CourierConstants.POST_CREATE_COMMENT:
        CommentStore._receiveComment( action.data.comment );
        break;
      case AppConstants.INITIALIZE_DATA:
        CommentStore._initializeComments( action.data )
        break;
      case SessionConstants.LOGIN_SUCCESS:
        CommentStore._flushComment();
        CommentStore._flushReply();
        CommentStore._flushVote();
        break;
      case CommentConstants.ADD_REPLY:
        CommentStore._handleAddReply( action.data );
        break;
      case CommentConstants.VOTE:
        CommentStore._handleAddVote( action.data );
        break;
    }

    return true;
  }),

  // private

  _addReply: function ( data ) {
    scribble.helpers.xhr.post(
      scribble.helpers.routes.api_comment_replies_url( data.comment_id ),
      data,
      CommentStore.handleCreateResponse
    )
  },

  _addVote: function ( data ) {
    scribble.helpers.xhr.post(
      scribble.helpers.routes.api_comment_votes_url( data.id ),
      {vote: data},
      CommentStore._handleVoteResponse
    );
  },

  _createComment: function ( data ) {
    scribble.helpers.xhr.post(
      scribble.helpers.routes.api_comments_url(),
      data,
      CommentStore.handleCreateResponse
    );
  },

  _flushComment: function () {
    if ( _pendingComment != null ) {
      this._createComment ( _pendingComment )
    }
  },

  _flushReply: function () {
    if ( _pendingReply != null ) {
      this._addReply( _pendingReply )
    }
  },

  _flushVote: function () {
    if( _pendingVote != null ) {
      this._addVote( _pendingVote );
      _pendingVote = null;
    }
  },

  _handleAddVote: function ( data ) {
    if ( !_comments[data.id] ) return;

    var userVote = _comments[data.id].current_user_vote,
        voteVal = data.positive ? 'up' : 'down';
    if ( userVote && voteVal === userVote ) return;

    _pendingVote = data;

    if ( SessionStore.isCurrentUserComplete() ) {
      this._addVote( _pendingVote );
    }
  },

  _handleAddReply: function ( data ) {
    _pendingReply = data;

    if ( SessionStore.isCurrentUserComplete() ) {
      this._addReply( _pendingReply );
    }
  },

  _handleCreateComment: function ( data ) {
    _pendingComment = data;

    if ( SessionStore.isCurrentUserComplete() ) {
      this._createComment( _pendingComment );
    }
  },

  _handleVoteResponse: function ( err, response ) {
    if ( err ) return;

    if ( response.status === 200 ) {
      _comments[response.data.comment.id] = response.data.comment;
    } else if ( response.status === 403 ) {
      // SessionStore.ensureCurrentUser();
    }

    CommentStore.emitChange();
  },

  _initializeComments: function ( data ) {
    if ( data.comments ) {
      for ( var i = 0; i < data.comments.length; i++ ) {
        _comments[data.comments[i].id] = data.comments[i];
      }
    }

    return _comments;
  },

  _receiveComment: function ( comment ) {
    _comments[comment.id] = comment;
    CommentStore.emitChange();
  },

  _setComments: function ( comments ) {
    CommentStore.reset();
    for ( var i in comments ) {
      var comment = comments[i]
      _comments[comment.id] = comment
    }

    CommentStore.emitChange();
  }
}});

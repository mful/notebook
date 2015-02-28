//= require_self

//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require shared/helpers/routes
//= require shared/helpers/xhr
//= require_tree ../../../../app/assets/javascripts/shared/constants

//= require ledger/actions/annotation_actions
//= require ledger/actions/comment_actions
//= require ledger/stores/annotation_store
//= require ledger/stores/comment_store
//= require ledger/stores/session_store

describe( 'CommentStore', function () {

  beforeEach( function () {
    CommentStore.reset();
  });

  describe( '#handleCreateResponse', function () {

    beforeEach( function () {
      spyOn( window, 'alert' );
    });

    describe( 'when there is a network error', function () {

      beforeEach( function () {
        CommentStore.handleCreateResponse( true, {} );
      });

      it( 'should alert the user', function () {
        expect( alert ).toHaveBeenCalled();
      });
    });

    describe( 'when there is a 400 error', function () {
      var errors = ['It must be at least 15 characters', 'Another error'],
          errorMessage = "Whoops! There were some errors:\n\n- It must be at least 15 characters\n- Another error";

      beforeEach( function () {
        var res = {status: 400, data: {errors: errors}};
        CommentStore.handleCreateResponse( false, res );
      });

      it( 'should alert the user to the errors', function () {
        expect( alert ).toHaveBeenCalledWith( errorMessage );
      });
    });

    describe( 'when the comment is successfully created', function () {

      var comment = {
        id: 1,
        content: 'A comment here.',
        annotation_id: 1,
        rating: 1,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      }

      beforeEach( function () {
        var res = {status: 200, data: {comment: comment}};

        spyOn( CommentStore, 'emitChange');

        CommentStore.handleCreateResponse( false, res );
      });

      it( 'should add the comment to the comments object', function () {
        expect( CommentStore.getAll()[1] ).toEqual( comment )
      });

      it( 'should emit a change', function () {
        expect( CommentStore.emitChange ).toHaveBeenCalled();
      });
    });
  });

  describe( '#getAll', function () {

    describe( 'when there are no annotations', function () {
      it( 'should return an empty object', function () {
        expect( CommentStore.getAll() ).toEqual( {} );
      });
    });

    describe( 'when there are some annotations', function () {

      var comment = {
        id: 1,
        content: 'A comment here.',
        annotation_id: 1,
        rating: 1,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      }

      beforeEach( function () {
        CommentStore._initializeComments({ comments: [comment] });
      });

      it( 'should return the annotations, as an object keyed by id', function () {
        expect( CommentStore.getAll() ).toEqual({ 1: comment })
      });
    });
  });

  describe( '#getAllAsList', function () {

    var comments = [
      {
        id: 1,
        content: 'A comment here.',
        annotation_id: 1,
        rating: 1,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      },
      {
        id: 2,
        content: 'Another comment here.',
        annotation_id: 1,
        rating: 2,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      }
    ];

    beforeEach( function () {
      CommentStore._initializeComments({ comments: comments });
    })

    it( 'should return an array of comments, sorted by rating', function () {
      expect( CommentStore.getAllAsList() ).toEqual( [comments[1], comments[0]] );
    });
  });

  describe( '#getByAnnotationAsList', function () {

    var comments = [
      {
        id: 1,
        content: 'A comment here.',
        annotation_id: 1,
        rating: 1,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      },
      {
        id: 2,
        content: 'Another comment here.',
        annotation_id: 1,
        rating: 2,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      },
      {
        id: 3,
        content: 'A third comment here.',
        annotation_id: 2,
        rating: 2,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      },
    ];

    beforeEach( function () {
      CommentStore._initializeComments({ comments: comments });
    });

    it( 'should return an array of comments, related to the given annotation id, sorted by rating', function () {
      expect( CommentStore.getByAnnotationAsList(1) ).toEqual( [comments[1], comments[0]] );
    });
  });

  describe( '#getById', function () {

    var comment = {
      id: 1,
      content: 'A comment here.',
      annotation_id: 1,
      rating: 1,
      score: 1,
      current_user_vote: 'up',
      reply_count: 0,
      parent_comment_id: null
    }

    describe( 'when given a callback', function () {

      beforeEach( function () {
        this.callback = function ( comment ) {};
        spyOn( this, 'callback' );
      });

      describe( 'and the comment is present in the store', function () {

        beforeEach( function () {
          CommentStore._initializeComments({ comments: [comment] });
          CommentStore.getById( 1, this.callback );
        });

        it( 'should call the callback, passing in the comment', function () {
          expect( this.callback ).toHaveBeenCalledWith( comment );
        });
      });

      describe( 'and the comment is not present in the store', function () {

        beforeEach( function () {
          CommentStore.getById( 1, this.callback );
        });

        it( 'should call the callback, passing in null', function () {
          expect( this.callback ).toHaveBeenCalledWith( null );
        });
      });
    });

    describe( 'when not given a callback', function () {

      describe( 'and the comment is present in the store', function () {

        beforeEach( function () {
          CommentStore._initializeComments({ comments: [comment] });
        });

        it( 'should return the comment', function () {
          expect( CommentStore.getById( 1 ) ).toEqual( comment );
        });
      });

      describe( 'and the comment is not present in the store', function () {
        it( 'should return null', function () {
          expect( CommentStore.getById( 1 ) ).toEqual( null );
        });
      });
    });
  });

  describe( '#getReplies', function () {

    var comment = {
      id: 2,
      content: 'A comment here.',
      annotation_id: 1,
      rating: 1,
      score: 1,
      current_user_vote: 'up',
      reply_count: 0,
      parent_comment_id: 1
    }

    describe( 'when not given a callback', function () {

      describe( 'and the comment is present in the store', function () {

        beforeEach( function () {
          CommentStore._initializeComments({ comments: [comment] });
        });

        it( 'should return the annotation', function () {
          expect( CommentStore.getReplies(1) ).toEqual( [comment] );
        });
      });

      describe( 'and the comment is not present in the store', function () {

        it( 'should return an empty list', function () {
          expect( CommentStore.getReplies(1) ).toEqual( [] );
        });
      });
    });

    describe( 'when given a callback', function () {

      beforeEach( function () {
        this.callback = function ( comment ) {};
        spyOn( this, 'callback' );
      });

      describe( 'and the comment is already present in the store', function () {

        beforeEach( function () {
          CommentStore._initializeComments({ comments: [comment] });
          CommentStore.getReplies( 1, this.callback );
        });

        it( 'should pass the comment to the callback', function () {
          expect( this.callback ).toHaveBeenCalledWith( [comment] );
        });
      });

      describe( 'and the comment has to be fetched from the server', function () {

        describe( 'and there is a network error', function () {

          beforeEach( function () {
            spyOn( scribble.helpers.xhr, 'get' ).and.callFake(
              function ( url, callback ) {
                return callback( true, {} );
              }
            );
            spyOn( window, 'alert' );

            CommentStore.getReplies( 1, this.callback );
          });

          it( 'should alert the user, of an issue', function () {
            expect( alert ).toHaveBeenCalled();
          });

          it( 'should not call the callback', function () {
            expect( this.callback ).not.toHaveBeenCalled();
          });
        });

        describe( 'and the replies are found', function () {

          beforeEach( function () {
            spyOn( scribble.helpers.xhr, 'get' ).and.callFake(
              function ( url, callback ) {
                return callback( false, {status: 200, data: {comments: [comment]}} );
              }
            );

            CommentStore.getReplies( 1, this.callback );
          });

          it( 'should call the callback, passing in the comment', function () {
            expect( this.callback ).toHaveBeenCalledWith( [comment] );
          });
        });
      })
    });
  });

  describe( '#sortByRating', function () {

    var comments = [
      {
        id: 1,
        content: 'A comment here.',
        annotation_id: 1,
        rating: 1,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      },
      {
        id: 2,
        content: 'Another comment here.',
        annotation_id: 1,
        rating: 3,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      },
      {
        id: 3,
        content: 'A third comment here.',
        annotation_id: 2,
        rating: 2,
        score: 1,
        current_user_vote: 'up',
        reply_count: 0,
        parent_comment_id: null
      },
    ];

    it( 'should return the comments, in descending rating order', function () {
      expect( CommentStore.sortByRating(comments) ).toEqual([ comments[1], comments[2], comments[0] ]);
    });
  });

  describe( '#reset', function () {

    var comment = {
      id: 2,
      content: 'A comment here.',
      annotation_id: 1,
      rating: 1,
      score: 1,
      current_user_vote: 'up',
      reply_count: 0,
      parent_comment_id: 1
    }

    beforeEach( function () {
      CommentStore._initializeComments({ comments: [comment] });
      CommentStore.reset();
    });

    it( 'should reset annotations to an empty object', function () {
      expect( CommentStore.getAll() ).toEqual( {} );
    });
  });

  describe( '#_addReply', function () {

    var data = {comment_id: 1};

    beforeEach( function () {
      spyOn( scribble.helpers.xhr, 'post' );
      CommentStore._addReply( data );
    });

    it( 'should post to the server, and delegate response handling to the appropriate function', function () {
      expect( scribble.helpers.xhr.post ).toHaveBeenCalledWith(
        'http://scribble.dev:3000/api/comments/1/replies',
        data,
        CommentStore.handleCreateResponse
      );
    });
  });

  describe( '#_addVote', function () {

    var data = {id: 1};

    beforeEach( function () {
      spyOn( scribble.helpers.xhr, 'post' );
      CommentStore._addVote( data );
    });

    it( 'should post to the server, and delegate response handling to the appropriate function', function () {
      expect( scribble.helpers.xhr.post ).toHaveBeenCalledWith(
        'http://scribble.dev:3000/api/comments/1/votes',
        {vote: data},
        CommentStore._handleVoteResponse
      );
    });
  });

  describe( '#_createComment', function () {

    var data = {content: 'a comment', annotation_id: 1};

    beforeEach( function () {
      spyOn( scribble.helpers.xhr, 'post' );
      CommentStore._createComment( data );
    });

    it( 'should post to the server, and delegate response handling to the appropriate function', function () {
      expect( scribble.helpers.xhr.post ).toHaveBeenCalledWith(
        'http://scribble.dev:3000/api/comments',
        data,
        CommentStore.handleCreateResponse
      );
    });
  });

  describe( '_flushComment', function () {

    var data = {};

    describe( 'when there is a pending comment', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );
        CommentStore._handleCreateComment( data );

        spyOn( CommentStore, '_createComment' );

        AppDispatcher.handleViewAction({
          actionType: SessionConstants.LOGIN_SUCCESS,
          data: data
        });
      });

      it( 'should try to create a comment', function () {
        expect( CommentStore._createComment.calls.count() ).toEqual( 1 );
      });
    });

    describe( 'when there is NOT a pending comment', function () {

      beforeEach( function () {
        spyOn( CommentStore, '_createComment' );
        CommentStore._flushComment();
      });

      it( 'should not try to create a comment', function () {
        expect( CommentStore._createComment ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '_flushReply', function () {

    var data = {};

    describe( 'when there is a pending reply', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );
        CommentStore._handleAddReply( data );

        spyOn( CommentStore, '_addReply' );

        AppDispatcher.handleViewAction({
          actionType: SessionConstants.LOGIN_SUCCESS,
          data: data
        });
      });

      it( 'should try to create a reply', function () {
        expect( CommentStore._addReply.calls.count() ).toEqual( 1 );
      });
    });

    describe( 'when there is NOT a pending reply', function () {

      beforeEach( function () {
        spyOn( CommentStore, '_addReply' );
        CommentStore._flushReply();
      });

      it( 'should not try to create a reply', function () {
        expect( CommentStore._addReply ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '_flushVote', function () {

    var comment = {
      id: 1,
      content: 'A comment here.',
      annotation_id: 1,
      rating: 1,
      score: 1,
      current_user_vote: 'up',
      reply_count: 0,
      parent_comment_id: null
    }

    var data = {
      current_user_vote: 'up',
      postive: false,
      id: 1
    };

    beforeEach( function () {
      CommentStore._initializeComments({ comments: [comment] });
    });

    describe( 'when there is a pending Vote', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );
        CommentStore._handleAddVote( data );

        spyOn( CommentStore, '_addVote' );

        AppDispatcher.handleViewAction({
          actionType: SessionConstants.LOGIN_SUCCESS,
          data: data
        });
      });

      it( 'should try to create a Vote', function () {
        expect( CommentStore._addVote.calls.count() ).toEqual( 1 );
      });
    });

    describe( 'when there is NOT a pending Vote', function () {

      beforeEach( function () {
        spyOn( CommentStore, '_addVote' );
        CommentStore._flushVote();
      });

      it( 'should not try to create a Vote', function () {
        expect( CommentStore._addVote ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '#_handleAddVote', function () {

    var comment = {
      id: 1,
      content: 'A comment here.',
      annotation_id: 1,
      rating: 1,
      score: 1,
      current_user_vote: 'up',
      reply_count: 0,
      parent_comment_id: null
    }

    var data = {
      postive: false,
      id: 1
    };

    beforeEach( function () {
      CommentStore._initializeComments({ comments: [comment] });
      spyOn( SessionStore, '_ensureCurrentUser' );
    });

    describe( 'when the comment is not in the store', function () {
      it( 'should return null', function () {
        expect( CommentStore._handleAddVote({ id: 123 }) ).toEqual( null );
      });
    });

    describe( 'when the current user vote matches the proposed vote', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' );

        AppDispatcher.handleViewAction({
          actionType: CommentConstants.VOTE,
          data: {id: 1, positive: true}
        });
      });

      it( 'should not consider creating a vote', function () {
        expect( SessionStore.isCurrentUserComplete ).not.toHaveBeenCalled();
      });
    });

    describe( 'when the current user vote does not match the current vote', function () {

      beforeEach( function () {
        spyOn( CommentStore, '_addVote' );
      });

      describe( 'and the current user is complete', function () {

        beforeEach( function () {
          spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( true );

          AppDispatcher.handleViewAction({
            actionType: CommentConstants.VOTE,
            data: data
          });
        });

        it( 'should create the vote', function () {
          expect( CommentStore._addVote ).toHaveBeenCalled();
        });
      });

      describe( 'and the current user is not complete', function () {

        beforeEach( function () {
          spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );

          AppDispatcher.handleViewAction({
            actionType: CommentConstants.VOTE,
            data: data
          });
        });

        it( 'should NOT create the vote', function () {
          expect( CommentStore._addVote ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe( '#_handleAddReply', function () {

    var data = {}

    beforeEach( function () {
      spyOn( SessionStore, '_ensureCurrentUser' );
      spyOn( CommentStore, '_addReply' );
    });

    describe( 'when the current user is complete', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( true );

        AppDispatcher.handleViewAction({
          actionType: CommentConstants.ADD_REPLY,
          data: data
        });
      });

      it( 'should create the reply', function () {
        expect( CommentStore._addReply ).toHaveBeenCalled();
      });
    });

    describe( 'when the current user is not complete', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );

        AppDispatcher.handleViewAction({
          actionType: CommentConstants.ADD_REPLY,
          data: data
        });
      });

      it( 'should NOT create the reply', function () {
        expect( CommentStore._addReply ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '#_handleCreateComment', function () {

    var data = {}

    beforeEach( function () {
      spyOn( SessionStore, '_ensureCurrentUser' );
      spyOn( CommentStore, '_createComment' );
    });

    describe( 'when the current user is complete', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( true );

        AppDispatcher.handleViewAction({
          actionType: CommentConstants.CREATE_COMMENT,
          data: data
        });
      });

      it( 'should create the reply', function () {
        expect( CommentStore._createComment ).toHaveBeenCalled();
      });
    });

    describe( 'when the current user is not complete', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );

        AppDispatcher.handleViewAction({
          actionType: CommentConstants.CREATE_COMMENT,
          data: data
        });
      });

      it( 'should NOT create the reply', function () {
        expect( CommentStore._createComment ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '#_handleVoteResponse', function () {

    describe( 'when there is a network error', function () {

      beforeEach( function () {
        spyOn( window, 'alert' );
        CommentStore._handleVoteResponse( true, {} );
      });

      it( 'should alert the user', function () {
        expect( alert ).toHaveBeenCalled();
      });
    });

    describe( 'after successful creation', function () {

      var comment = {id: 1}

      beforeEach( function () {
        spyOn( CommentStore, 'emitChange' );
        CommentStore._handleVoteResponse( false, {status: 200, data: {comment: comment}} );
      });

      it( 'should update the comment stored under that id', function () {
        expect( CommentStore.getAll()[1] ).toEqual( comment );
      });

      it( 'should emit a change', function () {
        expect( CommentStore.emitChange ).toHaveBeenCalled();
      });
    });
  });

  describe( '#_initializeComments', function () {
    var data = {
      comments: [
        {
          id: 1,
          content: 'A comment here.',
          annotation_id: 1,
          rating: 1,
          score: 1,
          current_user_vote: 'up',
          reply_count: 0,
          parent_comment_id: null
        }
      ]
    }

    beforeEach( function () {
      CommentStore._initializeComments( data );
    });

    it( 'should set the comments object based on the given data', function () {
      expect( CommentStore.getAll() ).toEqual({ 1: data.comments[0] });
    });
  });

  describe( '#_receiveComment', function () {

    var comment = {id: 1}

    beforeEach( function () {
      spyOn( CommentStore, 'emitChange' );
      CommentStore._receiveComment( comment );
    });

    it( 'should set the comment on the _comments object', function () {
      expect( CommentStore.getAll()[1] ).toEqual( comment );
    });

    it( 'should emit a change', function () {
      expect( CommentStore.emitChange ).toHaveBeenCalled();
    });
  });

  describe( '#_setComments', function () {

    var comments = [{id: 1}, {id: 2}]

    beforeEach( function () {
      spyOn( CommentStore, 'emitChange' );
      CommentStore._setComments( comments );
    });

    it( 'should set the comment on the _comments object', function () {
      expect( CommentStore.getAll() ).toEqual({ 1: comments[0], 2: comments[1] });
    });

    it( 'should emit a change', function () {
      expect( CommentStore.emitChange ).toHaveBeenCalled();
    });
  })
});










































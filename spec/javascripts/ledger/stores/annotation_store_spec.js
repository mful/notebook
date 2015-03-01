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

window.scribble || ( window.scribble = {} );

describe( 'AnnotationStore', function () {

  beforeEach( function () {
    AnnotationStore.reset();
  });

  describe( '#handleCreateResponse', function () {

    beforeEach( function () {
      spyOn( window, 'alert' );
    });

    describe( 'when there is a network error', function () {

      beforeEach( function () {
        AnnotationStore.handleCreateResponse( true, {} );
      });

      it( 'should alert the user', function () {
        expect( alert ).toHaveBeenCalledWith( 'Whoops! Something went wrong. Try again?' );
      });
    });

    describe( 'when there is a 400 error', function () {
      var errors = ['It must be at least 15 characters', 'Another error'],
          errorMessage = "Whoops! There were some errors:\n\n- It must be at least 15 characters\n- Another error";

      beforeEach( function () {
        var res = {status: 400, data: {errors: errors}};
        AnnotationStore.handleCreateResponse( false, res );
      });

      it( 'should alert the user to the errors', function () {
        expect( alert ).toHaveBeenCalledWith( errorMessage );
      });
    });

    describe( 'when the annotation is successfully created', function () {

      beforeEach( function () {
        this.comments = [
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
        this.data = {
          annotation: {
            id: 1,
            text: 'This is some text.',
            url: 'hogwarts.com/faculty/mcgonagol',
            base_domain: 'hogwarts.com',
            comments: this.comments
          }
        }
        var res = {status: 200, data: this.data};

        spyOn( AppDispatcher, 'handleStoreRequest');

        AnnotationStore.handleCreateResponse( false, res );
      });

      afterEach( function () {
        delete this.data;
      });

      it( 'should navigate to the annotation page', function () {
        expect( AppDispatcher.handleStoreRequest ).toHaveBeenCalledWith({
          actionType: 'navigate',
          data: {path: '/annotations/1'}
        });
      });

      it( 'should separate the comments from the annotation, sending them to the CommentStore', function () {
        expect( AnnotationStore.getAll()[1].comments ).toEqual( undefined );
        expect( AppDispatcher.handleStoreRequest ).toHaveBeenCalledWith({
          actionType: 'notify_comments',
          data: this.comments
        });
      });
    });
  });

  describe( '#getAll', function () {

    describe( 'when there are no annotations', function () {
      it( 'should return an empty object', function () {
        expect( AnnotationStore.getAll() ).toEqual( {} );
      });
    });

    describe( 'when there are some annotations', function () {

      var annotation = {
        id: 1,
        text: 'This is some text.',
        url: 'hogwarts.com/faculty/mcgonagol',
        base_domain: 'hogwarts.com'
      }

      beforeEach( function () {
        AnnotationStore._initializeAnnotations({ annotations: [annotation] });
      });

      it( 'should return the annotations, as an object keyed by id', function () {
        expect( AnnotationStore.getAll() ).toEqual({ 1: annotation })
      });
    });
  });

  describe( '#getById', function () {

    var annotation = {
        id: 1,
        text: 'This is some text.',
        url: 'hogwarts.com/faculty/mcgonagol',
        base_domain: 'hogwarts.com',
        comments: []
    }

    describe( 'when not given a callback', function () {

      describe( 'and the annotation is present in the store', function () {

        beforeEach( function () {
          AnnotationStore._initializeAnnotations({ annotations: [annotation] });
        });

        it( 'should return the annotation', function () {
          expect( AnnotationStore.getById(1) ).toEqual( annotation );
        });
      });

      describe( 'and the annotation is not present in the store', function () {

        it( 'should return null', function () {
          expect( AnnotationStore.getById(1) ).toEqual( null );
        });
      });
    });

    describe( 'when given a callback', function () {

      beforeEach( function () {
        this.callback = function ( annotation ) {};
        spyOn( this, 'callback' );
      });

      describe( 'and the annotation is already present in the store', function () {

        beforeEach( function () {
          AnnotationStore._initializeAnnotations({ annotations: [annotation] });
          AnnotationStore.getById( 1, this.callback );
        });

        it( 'should pass the annotation to the callback', function () {
          expect( this.callback ).toHaveBeenCalledWith( annotation );
        });
      });

      describe( 'and the annotation has to be fetched from the server', function () {

        describe( 'and there is a network error', function () {

          beforeEach( function () {
            spyOn( scribble.helpers.xhr, 'get' ).and.callFake(
              function ( url, callback ) {
                return callback( true, {} );
              }
            );
            spyOn( window, 'alert' );

            AnnotationStore.getById( 1, this.callback );
          });

          it( 'should alert the user, of an issue', function () {
            expect( alert ).toHaveBeenCalled();
          });

          it( 'should not call the callback', function () {
            expect( this.callback ).not.toHaveBeenCalled();
          });
        });

        describe( 'and the annotation cannot be found', function () {

          beforeEach( function () {
            spyOn( scribble.helpers.xhr, 'get' ).and.callFake(
              function ( url, callback ) {
                return callback( false, {status: 404} );
              }
            );
            spyOn( window, 'alert' );

            AnnotationStore.getById( 1, this.callback );
          });

          it( 'should alert the user, of an issue', function () {
            expect( alert ).toHaveBeenCalled();
          });

          it( 'should not call the callback', function () {
            expect( this.callback ).not.toHaveBeenCalled();
          });
        });

        describe( 'and the annotation is found', function () {

          beforeEach( function () {
            spyOn( scribble.helpers.xhr, 'get' ).and.callFake(
              function ( url, callback ) {
                return callback( false, {status: 200, data: {annotation: annotation}} );
              }
            );

            AnnotationStore.getById( 1, this.callback );
          });

          it( 'should call the callback, passing in the annotation', function () {
            expect( this.callback ).toHaveBeenCalledWith( annotation );
          });
        });
      })
    });
  });

  describe( '#reset', function () {

    var annotation = {
      id: 1,
      text: 'This is some text.',
      url: 'hogwarts.com/faculty/mcgonagol',
      base_domain: 'hogwarts.com'
    }

    beforeEach( function () {
      AnnotationStore._initializeAnnotations({ annotations: [annotation] });
      AnnotationStore.reset();
    });

    it( 'should reset annotations to an empty object', function () {
      expect( AnnotationStore.getAll() ).toEqual( {} );
    });
  });

  describe( '#separateComments', function () {

    beforeEach( function () {
      this.comments = [
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
      this.data = {
        annotation: {
          id: 1,
          text: 'This is some text.',
          url: 'hogwarts.com/faculty/mcgonagol',
          base_domain: 'hogwarts.com',
          comments: this.comments
        }
      }

      spyOn( AppDispatcher, 'handleStoreRequest' );

      AnnotationStore.separateComments( this.data );
    });

    it( 'should remove the comments from the annotation object', function () {
      expect( AnnotationStore.getById(1).comments ).toEqual( undefined );
    });

    it( 'should send the comments to the comment store', function () {
      expect( AppDispatcher.handleStoreRequest ).toHaveBeenCalledWith({
        actionType: 'notify_comments',
        data: this.comments
      });
    });
  });

  describe( '#_createWithComment', function () {

    var data = {
      annotation: {text: 'A sentence to annotate.'},
      url: 'hogwarts.com/1234',
      comment: {content: 'Not a very useful comment'}
    }

    beforeEach( function () {
      spyOn( scribble.helpers.xhr, 'post' );

      AnnotationStore._createWithComment( data );
    });

    it( 'should post to the server, and delegate response handling to the appropriate function', function () {
      expect( scribble.helpers.xhr.post ).toHaveBeenCalledWith(
        'http://scribble.dev:3000/api/annotations',
        data,
        AnnotationStore.handleCreateResponse
      );
    });
  });

  describe( '_flushPendingAnnotation', function () {

    var data = {
      annotation: {text: 'A sentence to annotate.'},
      url: 'hogwarts.com/1234',
      comment: {content: 'Not a very useful comment'}
    }

    describe( 'when there is a pending annotation', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );
        AnnotationStore._handleCreateWithComment( data );

        spyOn( AnnotationStore, '_createWithComment' );

        AppDispatcher.handleViewAction({
          actionType: SessionConstants.LOGIN_SUCCESS,
          data: data
        })
      });

      it( 'should try to create an annotation', function () {
        expect( AnnotationStore._createWithComment.calls.count() ).toEqual( 1 );
      });
    });

    describe( 'when there is NOT a pending annotation', function () {

      beforeEach( function () {
        spyOn( AnnotationStore, '_createWithComment' );
        AnnotationStore._flushPendingAnnotation();
      });

      it( 'should not try to create an annotation', function () {
        expect( AnnotationStore._createWithComment ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '#_handleCreateWithComment', function () {

    var data = {
      annotation: {text: 'A sentence to annotate.'},
      url: 'hogwarts.com/1234',
      comment: {content: 'Not a very useful comment'}
    }

    beforeEach( function () {
      spyOn( SessionStore, '_ensureCurrentUser' );
      spyOn( AnnotationStore, '_createWithComment' );
    });

    describe( 'when the current user is complete', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( true );

        AppDispatcher.handleViewAction({
          actionType: AnnotationConstants.CREATE_WITH_COMMENT,
          data: data
        });
      });

      it( 'should create the annotation', function () {
        expect( AnnotationStore._createWithComment ).toHaveBeenCalled();
      });
    });

    describe( 'when the current user is not complete', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );

        AppDispatcher.handleViewAction({
          actionType: AnnotationConstants.CREATE_WITH_COMMENT,
          data: data
        });
      });

      it( 'should NOT create the annotation', function () {
        expect( AnnotationStore._createWithComment ).not.toHaveBeenCalled();
      });

      it( 'should set a pending annotation', function () {
        expect( AnnotationStore.getPending() ).toEqual( data );
      });
    });
  });

  describe( '#_initializeAnnotations', function () {

    var data = {
          annotations: [
            {
              id: 1,
              text: 'This is some text.',
              url: 'hogwarts.com/faculty/mcgonagol',
              base_domain: 'hogwarts.com'
            }
          ]
        },
        expectedResult = {1: data.annotations[0]}

    beforeEach( function () {
      AppDispatcher.handleViewAction({
        actionType: AppConstants.INITIALIZE_DATA,
        data: data
      });
    });

    it( 'should populate the annotations object, with the given annotations, keyed by id', function () {
      expect( AnnotationStore.getAll() ).toEqual( expectedResult );
    });
  });

});

//= require_self

//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require shared/helpers/analytics
//= require_tree ../../../../app/assets/javascripts/shared/constants

//= require ledger/stores/comment_store
//= require ledger/stores/annotation_store
//= require ledger/stores/session_store
//= require ledger/actions/analytics_actions
//= require ledger/actions/app_actions
//= require ledger/mixins/comment_list_mixin
//= require ledger/components/comment
//= require ledger/components/reply_list
//= require ledger/components/comment_page

window.scribble_bootstrap = {};
window.scribble || ( window.scribble = {} );

describe( 'AnnotationPage', function () {

  var instance,
      container,
      comment = {id: 1, content: 'A comment to read', userVote: 'up', reply_count: 1, annotation_id: 3},
      replies = [{id: 2, content: 'Some text here!', userVote: 'up', reply_count: 0}],
      props = {
        replies: replies,
        comment: comment
      };

  beforeEach( function () {
    container = document.createElement("div");
    document.body.appendChild( container );
  });

  afterEach( function() {
    if ( instance && instance.isMounted() ) {
      // Only components with a parent will be unmounted
      React.unmountComponentAtNode( instance.getDOMNode().parentElement );
      instance = null;
    }
    document.body.removeChild( container );
    container = null;
  });

  describe( 'initialization', function () {

    describe( 'when server rendered', function () {
      beforeEach( function () {
        serverProps = {
          replies: replies,
          comment: comment,
          server_rendered: true
        };

        spyOn( scribble.helpers.analytics, 'trackGoogleEvent' )

        instance = React.renderComponent( CommentPage(serverProps), container );
      });

      it( 'should set the comments in the Comment Store', function () {
        expect( CommentStore.getAll() ).toEqual({ 2: replies[0], 1: comment });
      });

      it( 'should track an annotation view', function () {
        expect( scribble.helpers.analytics.trackGoogleEvent.calls.count() ).toEqual( 1 );
        expect( scribble.helpers.analytics.trackGoogleEvent ).toHaveBeenCalledWith( 'View Replies', 1, 1 );
      });

      describe( 'when there is a reply id given', function () {

        var replyComponent = document.createElement( 'div' );

        beforeEach( function () {
          notifyProps = {
            replies: replies,
            comment: comment,
            server_rendered: true,
            reply_id: 2
          };

          spyOn( document, 'querySelector' ).and.returnValue( replyComponent );
          spyOn( replyComponent, 'scrollIntoViewIfNeeded' );

          React.unmountComponentAtNode( instance.getDOMNode().parentElement );
          instance = React.renderComponent( CommentPage(notifyProps), container );
        });

        it( 'should attempt to scroll to the requested reply', function () {
          expect( replyComponent.scrollIntoViewIfNeeded ).toHaveBeenCalled();
        });
      });
    });

    describe( 'when not server rendered', function () {

      beforeEach( function () {
        spyOn( AppActions, 'initializeData' );
        spyOn( scribble.helpers.analytics, 'trackGoogleEvent' )

        instance = React.renderComponent( CommentPage(props), container );
      });

      it( 'should not try to initialized any data', function () {
        expect( AppActions.initializeData.calls.count() ).toEqual( 0 );
      });

      it( 'should track an annotation view', function () {
        expect( scribble.helpers.analytics.trackGoogleEvent.calls.count() ).toEqual( 1 );
        expect( scribble.helpers.analytics.trackGoogleEvent ).toHaveBeenCalledWith( 'View Replies', 1, 1 );
      });
    });
  });

  describe( '#submitHandler', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentPage(props), container );

      spyOn( CommentStore, '_handleAddReply' );
      spyOn( SessionStore, '_ensureCurrentUser' );

      instance.submitHandler( 'some content here' );
    });

    it( 'should delegate responsiblity to the store', function () {
      expect( CommentStore._handleAddReply ).toHaveBeenCalled();
    });
  });

});

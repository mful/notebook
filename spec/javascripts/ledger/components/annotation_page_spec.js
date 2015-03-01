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
//= require ledger/components/comment_list
//= require ledger/components/annotation_page

window.scribble_bootstrap = {};
window.scribble || ( window.scribble = {} );

describe( 'AnnotationPage', function () {

  var instance,
      container,
      annotation = {id: 1, url: 'hogwarts.com/articles/zero-tolerance-policy'},
      comments = [{id: 2, content: 'Some text here!', userVote: 'up', replyCount: 0}],
      props = {
        annotation: annotation,
        comments: comments
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
          annotation: annotation,
          comments: comments,
          server_rendered: true
        };

        spyOn( scribble.helpers.analytics, 'trackGoogleEvent' )

        instance = React.renderComponent( AnnotationPage(serverProps), container );
      });

      it( 'should set the annotations in the Annotation Store', function () {
        expect( AnnotationStore.getAll() ).toEqual({ 1: annotation });
      });

      it( 'should set the comments in the Comment Store', function () {
        expect( CommentStore.getAll() ).toEqual({ 2: comments[0] });
      });

      it( 'should track an annotation view', function () {
        expect( scribble.helpers.analytics.trackGoogleEvent.calls.count() ).toEqual( 1 );
        expect( scribble.helpers.analytics.trackGoogleEvent ).toHaveBeenCalledWith( 'View Annotation', annotation.url, 1 );
      });
    });

    describe( 'when not server rendered', function () {

      beforeEach( function () {
        spyOn( AppActions, 'initializeData' );
        spyOn( scribble.helpers.analytics, 'trackGoogleEvent' )

        instance = React.renderComponent( AnnotationPage(props), container );
      });

      it( 'should not try to initialized any data', function () {
        expect( AppActions.initializeData.calls.count() ).toEqual( 0 );
      });

      it( 'should track an annotation view', function () {
        expect( scribble.helpers.analytics.trackGoogleEvent.calls.count() ).toEqual( 1 );
        expect( scribble.helpers.analytics.trackGoogleEvent ).toHaveBeenCalledWith( 'View Annotation', annotation.url, 1 );
      });
    });
  });

  describe( '#submitHandler', function () {

    beforeEach( function () {
      instance = React.renderComponent( AnnotationPage(props), container );

      spyOn( CommentStore, '_handleCreateComment' );
      spyOn( SessionStore, '_ensureCurrentUser' );

      instance.submitHandler( 'some content here' );
    });

    it( 'should delegate responsiblity to the store', function () {
      expect( CommentStore._handleCreateComment ).toHaveBeenCalled();
    });
  });

});

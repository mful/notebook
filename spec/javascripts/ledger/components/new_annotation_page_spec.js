//= require_self

//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require shared/helpers/analytics
//= require_tree ../../../../app/assets/javascripts/shared/constants

//= require ledger/stores/annotation_store
//= require ledger/stores/session_store
//= require ledger/actions/analytics_actions
//= require ledger/actions/annotation_actions
//= require ledger/components/new_annotation_page

window.scribble_bootstrap = {};
window.scribble || ( window.scribble = {} );

describe( 'NewAnnotationPage', function () {

  var instance,
      container,
      annotation = {id: 1, url: 'hogwarts.com/articles/zero-tolerance-policy'},
      comments = [{id: 2, content: 'Some text here!', userVote: 'up', replyCount: 0}],
      props = {
        url: 'hogwarts.com/faculty/mcgonagol',
        text: 'She is an animagus.'
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

  describe( '#_submitHandler', function () {

    beforeEach( function () {
      instance = React.renderComponent( NewAnnotationPage(props), container );

      spyOn( SessionStore, '_ensureCurrentUser' );
      spyOn( AnnotationStore, '_handleCreateWithComment' );

      instance.submitHandler( 'some content here' );
    });

    it( 'should delegate to the AnnotationStore', function () {
      expect( AnnotationStore._handleCreateWithComment ).toHaveBeenCalledWith({
        annotation: {text: props.text},
        url: props.url,
        comment: {content: 'some content here'}
      });
    });
  });
});

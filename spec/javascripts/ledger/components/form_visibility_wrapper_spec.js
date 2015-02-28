//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require ledger/stores/comment_store
//= require ledger/mixins/comment_list_mixin
//= require ledger/components/comment_list
//= require ledger/components/comment_form
//= require ledger/components/form_visibility_wrapper

window.scribble || ( window.scribble = {} );

describe( 'FormVisibilityWrapper', function () {

  var instance,
      container,
      commentList = CommentList({ comments: [] }),
      props = {
        commentList: commentList,
        submitHandler: function () {},
        headerGetter: function () { return {offsetTop: 10, clientHeight: 20}; },
        type: 'comment'
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


  describe( 'initial state', function () {
    describe( 'when given an initial visibility state', function () {

      beforeEach( function () {
        var visProps = {
          commentList: commentList,
          submitHandler: function () {},
          headerGetter: function () { return {offsetTop: 10, clientHeight: 20}; },
          type: 'comment',
          visibility: 'expanded'
        }
        instance = React.renderComponent( FormVisibilityWrapper(visProps), container );
      });

      it( 'should set the visibility of the form to the expected value', function () {
        expect( instance.state.formVisibility ).toEqual( 'expanded' );
      });
    });

    describe( 'when NOT given an initial visibility state', function () {

      beforeEach( function () {
        instance = React.renderComponent( FormVisibilityWrapper(props), container );
      });

      it( 'should set the visibility to collapsed', function () {
        expect( instance.state.formVisibility ).toEqual( 'collapsed' );
      });
    });
  });

  describe( '#commentList', function () {

    describe( 'when given a commentList', function () {

      beforeEach( function () {
        instance = React.renderComponent( FormVisibilityWrapper(props), container );
      });

      it( 'should return a CommentList component', function () {
        expect( instance.commentList() ).toEqual( commentList );
      });
    });

    describe( 'when not given a commentList', function () {

      beforeEach( function () {
        var listlessProps = {
          submitHandler: function () {},
          headerGetter: function () { return {offsetTop: 10, clientHeight: 20}; },
          type: 'comment'
        };
        instance = React.renderComponent( FormVisibilityWrapper(listlessProps), container );
      });

      it( 'should return undefined', function () {
        expect( instance.commentList() ).toEqual( undefined );
      })
    });
  });

  describe( '#commentListVisClass', function () {

    describe( 'when the form should be expanded', function () {

      beforeEach( function () {
        instance = React.renderComponent( FormVisibilityWrapper(props), container );
        instance.setState({ formVisibility: 'expanded' });
      });

      it( 'should return the class to hide the list, with a prepended space', function () {
        expect( instance.commentListVisClass() ).toEqual( ' hidden' );
      });
    });

    describe( 'when the form is open', function () {
      beforeEach( function () {
        instance = React.renderComponent( FormVisibilityWrapper(props), container );
        instance.setState({ formVisibility: 'open' });
      });

      it( 'should return undefined', function () {
        expect( instance.commentListVisClass() ).toEqual( undefined );
      });
    });

    describe( 'when the form is collapsed', function () {
      beforeEach( function () {
        instance = React.renderComponent( FormVisibilityWrapper(props), container );
        instance.setState({ formVisibility: 'collapsed' });
      });

      it( 'should return undefined', function () {
        expect( instance.commentListVisClass() ).toEqual( undefined );
      });
    });
  });

  describe( '#visibilityHandler', function () {

    beforeEach( function () {
      instance = React.renderComponent( FormVisibilityWrapper(props), container );
      instance.visibilityHandler( 'expanded' );
    });

    it( 'should set the visibility to the given state', function () {
      expect( instance.state.formVisibility ).toEqual( 'expanded' );
    });
  });

  describe( '#formVisibilityClass', function () {

    describe( 'when the form is open', function () {

      beforeEach( function () {
        instance = React.renderComponent( FormVisibilityWrapper(props), container );
        instance.setState({ formVisibility: 'open' });
      });

      it( 'should return the appropriate open class, with a prepended space', function () {
        expect( instance.formVisibilityClass() ).toEqual( ' form-open' );
      });
    });

    describe( 'when the form is collapsed', function () {

      beforeEach( function () {
        instance = React.renderComponent( FormVisibilityWrapper(props), container );
        instance.setState({ formVisibility: 'collapsed' });
      });

      it( 'should return the appropriate collapsed class, with a prepended space', function () {
        expect( instance.formVisibilityClass() ).toEqual( ' form-collapsed' );
      });
    });

    describe( 'when the form is expanded', function () {

      beforeEach( function () {
        instance = React.renderComponent( FormVisibilityWrapper(props), container );
        instance.setState({ formVisibility: 'expanded' });
      });

      it( 'should return the appropriate expanded class, with a prepended space', function () {
        expect( instance.formVisibilityClass() ).toEqual( ' form-expanded' );
      });
    });
  });

});

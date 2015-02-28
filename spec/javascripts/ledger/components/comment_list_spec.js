//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require ledger/stores/comment_store
//= require ledger/mixins/comment_list_mixin
//= require ledger/components/comment
//= require ledger/components/comment_list

describe( 'CommentList', function () {

  var instance,
      container,
      props = {
        comments: [{id: 1, content: 'A comment to read', userVote: 'up', reply_count: 1, annotation_id: 3, rating: 1}],
        type: 'comment'
      };

  beforeEach( function () {
    container = document.createElement( "div" );
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

    beforeEach( function () {
      sortProps = {
        comments: [
          {id: 1, content: 'A comment to read', userVote: 'up', reply_count: 1, annotation_id: 3, rating: 1}
          {id: 2, content: 'Another comment to read', userVote: 'down', reply_count: 0, annotation_id: 3, rating: 2}
        ],
        type: 'comment'
      };

      instance = React.renderComponent( CommentList(sortProps), container );
    });

    it( 'should set the comments state, to the given comments, sorted by rating', function () {
      expect( instance.state.comments[0] ).toEqual( sortProps.comments[1] );
      expect( instance.state.comments[1] ).toEqual( sortProps.comments[0] );
    });
  });

  describe( '#_onChange', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentList(props), container );
      spyOn( instance, 'setState' ).and.callThrough();
    });

    describe( 'when there is a new comment', function () {
      var newComment = {id: 2, content: 'A second comment', userVote: null, reply_count: 0, annotation_id: 3};

      beforeEach( function () {
        spyOn( CommentStore, 'getByAnnotationAsList' ).and.returnValue([
          instance.props.comments[0],
          newComment
        ])

        instance._onChange();
      });

      it( 'should set the new comment in the state hash', function () {
        expect( instance.state.newComment ).toEqual( newComment );
      })
    });

    describe( 'when there is not a new comment', function () {
      beforeEach( function () {
        spyOn( CommentStore, 'getByAnnotationAsList' ).and.returnValue([
          instance.props.comments[0]
        ])

        instance._onChange();
      });

      it( 'should not update the state hash', function () {
        expect( instance.setState ).not.toHaveBeenCalled();
      })
    });
  });
});

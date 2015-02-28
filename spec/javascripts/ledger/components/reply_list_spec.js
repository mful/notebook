//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require ledger/stores/comment_store
//= require ledger/mixins/comment_list_mixin
//= require ledger/components/comment
//= require ledger/components/reply_list

describe( 'ReplyList', function () {

  var instance,
      container,
      props = {
        comment: {id: 1, content: 'A comment to read', userVote: 'up', reply_count: 1, annotation_id: 3, rating: 1},
        replies: [{id: 2, content: 'A reply to read', userVote: null, reply_count: 0, annotation_id: null, rating: 1, parent_comment_id: 1}],
        type: 'reply'
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

  describe( '#_onChange', function () {

    beforeEach( function () {
      instance = React.renderComponent( ReplyList(props), container );
      spyOn( instance, 'setState' ).and.callThrough();
      spyOn( CommentStore, 'getById' ).and.returnValue( props.comment );
    });

    describe( 'when there is a new comment', function () {
      var newComment = {id: 3, content: 'A second comment', userVote: null, reply_count: 0, annotation_id: 3};

      beforeEach( function () {
        spyOn( CommentStore, 'getReplies' ).and.returnValue([
          instance.props.replies[0],
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
        spyOn( CommentStore, 'getReplies' ).and.returnValue([
          instance.props.replies[0]
        ])

        instance._onChange();
      });

      it( 'should not update the state hash', function () {
        expect( instance.setState ).not.toHaveBeenCalled();
      })
    });
  });

});

//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require ledger/stores/comment_store
//= require ledger/mixins/comment_list_mixin

describe( 'CommentListMixin', function () {

  beforeEach( function () {
    spyOn( CommentStore, 'addChangeListener' );
    spyOn( CommentStore, 'removeChangeListener' );
  });

  describe( '#componentDidUpdate', function () {
    var commentDiv = document.createElement( 'div' );

    beforeEach( function () {
      spyOn( document, 'querySelector' ).and.returnValue( commentDiv );
      spyOn( window, 'setTimeout' );
    });

    describe( 'when there is a new comment', function () {

      beforeEach( function () {
        CommentListMixin.state = {newComment: {id: 1}}
        CommentListMixin.componentDidUpdate();
      });

      it( 'should attempt to scroll the comment into view', function () {
        expect( setTimeout ).toHaveBeenCalled();
      });
    });

    describe( 'when there is not a new comment', function () {

      beforeEach( function () {
        CommentListMixin.state = {newComment: null}
        CommentListMixin.componentDidUpdate();
      });

      it( 'should attempt to scroll the comment into view', function () {
        expect( setTimeout ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '#getNewComment', function () {

    describe( 'when there is a new comment', function () {
      var currents = [{id: 1}, {id: 2}],
          newComment = {id: 3},
          news = [{id: 1}, newComment, {id: 2}];

      it( 'should return the new comment', function () {
        expect( CommentListMixin.getNewComment(currents, news) ).toEqual( newComment );
      });
    });

    describe( 'when there is not a new comment', function () {
      var currents = [{id: 1}, {id: 2}],
          news = [{id: 2}, {id: 1}];

      it( 'should return null', function () {
        expect( CommentListMixin.getNewComment(currents, news) ).toEqual( null );
      });
    });
  });
});

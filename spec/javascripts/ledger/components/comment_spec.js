//= require_self
//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher
//= require shared/helpers/routes
//= require shared/constants/router_constants
//= require ledger/stores/comment_store
//= require ledger/actions/comment_actions
//= require ledger/components/voting_booth
//= require ledger/components/comment

window.scribble || ( window.scribble = {} );

describe( 'Comment', function () {

  var instance,
      container,
      props = {
        type: 'comment',
        comment: {
          id: 1,
          annotation_id: 2,
          content: 'To be or not to be.',
          reply_count: 0,
          score: 2,
          userVote: null
        }
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
  });

  describe( '#replyButtonText', function () {

    beforeEach( function () {
      instance = React.renderComponent( Comment(props), container );
    });

    describe( 'when the replyCount is 0', function () {

      it( 'should return "reply"', function () {
        expect( instance.replyButtonText() ).toEqual( 'reply' );
      });
    });

    describe( 'when the replyCount is not 0', function () {
      beforeEach( function () {
        instance.setState({ replyCount: 1 });
      });

      it( 'should return the view CTA, with the count', function () {
        expect( instance.replyButtonText() ).toEqual( 'view replies ( 1 )' );
      });
    });
  });

  describe( '#typeClass', function () {

    beforeEach( function () {
      instance = React.renderComponent( Comment(props), container );
    });

    describe( 'when given a comment-header type', function () {
      it( 'should return the comment-header class, with a prepended space', function () {
        expect( instance.typeClass('comment-header') ).toEqual( ' comment-header' );
      });
    });

    describe( 'when given a reply type', function () {
      it( 'should return the reply class, with a prepended space', function () {
        expect( instance.typeClass('reply') ).toEqual( ' reply' );
      });
    });

    describe( 'when given a comment type', function () {
      it( 'should return the an empty string', function () {
        expect( instance.typeClass('comment') ).toEqual( '' );
      });
    });
  });

  describe( '#viewReplies', function () {

    beforeEach( function () {
      instance = React.renderComponent( Comment(props), container );
      spyOn( AppDispatcher, 'handleViewAction' );
    });

    describe( 'when there are no replies', function () {

      beforeEach( function () {
        React.addons.TestUtils.Simulate.click( instance.refs.viewReplies.getDOMNode() );
      });

      it( 'should navigate to the the comment page, passing the need to set the form as open', function () {
        expect( AppDispatcher.handleViewAction ).toHaveBeenCalledWith({
          actionType: RouterConstants.NAVIGATE,
          data: {
            path: '/comments/1?formVisibility=open'
          }
        });
      });
    });

    describe( 'when there are replies', function () {

      beforeEach( function () {
        instance.setState({ replyCount: 1 });
        React.addons.TestUtils.Simulate.click( instance.refs.viewReplies.getDOMNode() );
      });

      it( 'should navigate to the comments page, without opening the form', function () {
        expect( AppDispatcher.handleViewAction ).toHaveBeenCalledWith({
          actionType: RouterConstants.NAVIGATE,
          data: {
            path: '/comments/1'
          }
        });
      });
    });
  });

  describe( '#votingBooth', function () {

    beforeEach( function () {
      this.booth = {};
      spyOn( window, 'VotingBooth' ).and.returnValue( this.booth );
    });

    describe( 'when the comment is not a reply', function () {
      beforeEach( function () {
        instance = React.renderComponent( Comment(props), container );
      });

      it( 'should return a VotingBooth component', function () {
        expect( instance.votingBooth() ).toEqual( this.booth );
      });
    });

    describe( 'when the comment is a reply', function () {

      beforeEach( function () {
        replyProps = {
          type: 'reply',
          comment: {
            id: 1,
            annotation_id: 2,
            content: 'To be or not to be.',
            reply_count: 0,
            score: 2,
            userVote: null
          }
        };
        instance = React.renderComponent( Comment(replyProps), container );
      });

      it( 'should return undefined', function () {
        expect( instance.votingBooth() ).toEqual( undefined );
      });
    });
  });

});

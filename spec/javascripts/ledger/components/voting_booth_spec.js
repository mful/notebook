//= require react
//= require react_ujs
//= require underscore
//= require ledger/actions/comment_actions
//= require ledger/components/voting_booth

describe( 'VotingBooth', function () {

  var instance,
      container = document.createElement("div"),
      props = {
        commentId: 1,
        score: 2,
        userVote: null
      };

  beforeEach( function () {
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

  describe( 'initial state', function () {

    beforeEach( function () {
      instance = React.renderComponent( VotingBooth(props), container );
    });

    it( 'should show the score', function () {
      expect( instance.refs.voteCount.getDOMNode().textContent ).toEqual( '2' );
    });

    describe( 'when the current user has not voted', function () {

      it( 'should not set either vote direction to active', function () {
        expect( instance.refs.upVote.getDOMNode().className.match(/active/) ).toEqual( null );
        expect( instance.refs.downVote.getDOMNode().className.match(/active/) ).toEqual( null );
      });
    });

    describe( 'when the current user has voted', function () {
      beforeEach( function () {
        upProps = {
          commentId: 1,
          score: 2,
          userVote: 'up'
        };
        instance = React.renderComponent( VotingBooth(upProps), container );
      });

      it( 'should set the selected arrow as active', function () {
        expect( !!instance.refs.upVote.getDOMNode().className.match(/active/) ).toEqual( true );
      });

      it( 'should not activate the non-selected arrow', function () {
        expect( instance.refs.downVote.getDOMNode().className.match(/active/) ).toEqual( null );
      });
    });
  });

  describe( '#upVote', function () {

    beforeEach( function () {
      spyOn( CommentActions, 'vote' );
    });

    describe( 'when the user has not voted', function () {
      beforeEach( function () {
        instance = React.renderComponent( VotingBooth(props), container );
        React.addons.TestUtils.Simulate.click( instance.refs.upVote.getDOMNode() );
      });

      it( 'should pass to the store to handle creating an up vote', function () {
        expect( CommentActions.vote.calls.count() ).toEqual( 1 );
        expect( CommentActions.vote ).toHaveBeenCalledWith({
          id: 1,
          positive: true
        })
      });
    });

    describe( 'when the user previously down-voted', function () {
      beforeEach( function () {
        downProps = {
          commentId: 1,
          score: 2,
          userVote: 'down'
        };
        instance = React.renderComponent( VotingBooth(downProps), container );
        React.addons.TestUtils.Simulate.click( instance.refs.upVote.getDOMNode() );
      });

      it( 'should pass to the store to handle creating an up vote', function () {
        expect( CommentActions.vote.calls.count() ).toEqual( 1 );
        expect( CommentActions.vote ).toHaveBeenCalledWith({
          id: 1,
          positive: true
        })
      });
    });

    describe( 'when the user already up-voted the comment', function () {
      beforeEach( function () {
        upProps = {
          commentId: 1,
          score: 2,
          userVote: 'up'
        };
        instance = React.renderComponent( VotingBooth(upProps), container );
        React.addons.TestUtils.Simulate.click( instance.refs.upVote.getDOMNode() );
      });

      it( 'should NOT pass to the store to create an up vote', function () {
        expect( CommentActions.vote ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '#downVote', function () {

    beforeEach( function () {
      spyOn( CommentActions, 'vote' );
    });

    describe( 'when the user has not voted', function () {
      beforeEach( function () {
        instance = React.renderComponent( VotingBooth(props), container );
        React.addons.TestUtils.Simulate.click( instance.refs.downVote.getDOMNode() );
      });

      it( 'should pass to the store to handle creating an up vote', function () {
        expect( CommentActions.vote.calls.count() ).toEqual( 1 );
        expect( CommentActions.vote ).toHaveBeenCalledWith({
          id: 1,
          positive: false
        })
      });
    });

    describe( 'when the user previously down-voted', function () {
      beforeEach( function () {
        downProps = {
          commentId: 1,
          score: 2,
          userVote: 'down'
        };
        instance = React.renderComponent( VotingBooth(downProps), container );
        React.addons.TestUtils.Simulate.click( instance.refs.downVote.getDOMNode() );
      });

      it( 'should NOT pass to the store to create an up vote', function () {
        expect( CommentActions.vote ).not.toHaveBeenCalled();
      });
    });

    describe( 'when the user already up-voted the comment', function () {
      beforeEach( function () {
        upProps = {
          commentId: 1,
          score: 2,
          userVote: 'up'
        };
        instance = React.renderComponent( VotingBooth(upProps), container );
        React.addons.TestUtils.Simulate.click( instance.refs.downVote.getDOMNode() );
      });

      it( 'should pass to the store to handle creating an up vote', function () {
        expect( CommentActions.vote.calls.count() ).toEqual( 1 );
        expect( CommentActions.vote ).toHaveBeenCalledWith({
          id: 1,
          positive: false
        })
      });
    });
  });

  describe( '#voteClassName', function () {
    describe( 'when the user has voted in the same direction as the given param', function () {

      beforeEach( function () {
        upProps = {
          commentId: 1,
          score: 2,
          userVote: 'up'
        };
        instance = React.renderComponent( VotingBooth(upProps), container );
      });

      it( 'should return the className including active', function () {
        expect( instance.voteClassName('up') ).toEqual( 'vote up-vote active' );
      });
    });

    describe( 'when the user has not voted in the same direction as the given param', function () {

      beforeEach( function () {
        upProps = {
          commentId: 1,
          score: 2,
          userVote: 'up'
        };
        instance = React.renderComponent( VotingBooth(upProps), container );
      });

      it( 'should return the className including active', function () {
        expect( instance.voteClassName('down') ).toEqual( 'vote down-vote' );
      });
    });
  });
});

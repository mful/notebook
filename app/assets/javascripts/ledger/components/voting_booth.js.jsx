/** @jsx React.DOM */

var VotingBooth = React.createClass({

  getInitialState: function () {
    return {
      score: this.props.score,
      userVote: this.props.userVote
    }
  },

  componentWillReceiveProps: function ( props ) {
    return this.setState({
      score: props.score,
      userVote: props.userVote
    });
  },

  upVote: function ( e ) {
    e.stopPropagation();
    if ( this.state.userVote === 'up' ) return;
    return this.vote( true );
  },

  downVote: function ( e ) {
    e.stopPropagation();
    if ( this.state.userVote === 'down' ) return;
    return this.vote( false );
  },

  vote: function ( positive ) {
    return CommentActions.vote({
      id: this.props.commentId,
      positive: positive
    });
  },

  voteClassName: function ( direction ) {
    var baseClass = 'vote ' + direction + '-vote'

    if ( direction === this.state.userVote ) {
      return baseClass + ' active';
    }

    return baseClass;
  },

  render: function () {
    return(
      <div className="voting-booth-component">
        <div ref="upVote" className={ this.voteClassName('up') } onClick={ this.upVote }>
          <i className="ion-ios-play"></i>
        </div>

        <p ref="voteCount" className="vote-count">
          { this.state.score }
        </p>

        <div ref="downVote" className={ this.voteClassName('down') } onClick={ this.downVote }>
          <i className="ion-ios-play"></i>
        </div>
      </div>
    );
  }
});

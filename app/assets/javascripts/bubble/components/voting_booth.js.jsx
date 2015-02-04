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

  upVote: function () {
    if ( this.state.userVote === 'up' ) return;
    return this.vote( true );
  },

  downVote: function () {
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
        <div className="row">
          <div className="small-12 column">
            <div className={ this.voteClassName('up') } onClick={ this.upVote }></div>
          </div>
        </div>

        <div className="row">
          <div className="small-12 column">
            <p className="vote-count">
              { this.state.score }
            </p>
          </div>
        </div>

        <div className="row">
          <div className="small-12 column">
            <div className={ this.voteClassName('down') } onClick={ this.downVote }></div>
          </div>
        </div>
      </div>
    );
  }
});

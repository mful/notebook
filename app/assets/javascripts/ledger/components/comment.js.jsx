/** @jsx React.DOM */

var Comment = React.createClass({

  getInitialState: function () {
    return {
      content: this.props.comment.content,
      replyCount: this.props.comment.reply_count,
      score: this.props.comment.score,
      userVote: this.props.comment.current_user_vote
    }
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({
      content: props.comment.content,
      replyCount: props.comment.reply_count,
      score: props.comment.score,
      userVote: props.comment.current_user_vote
    });
  },

  replyButtonText: function () {
    if ( this.state.replyCount === 0 ) {
      return 'Reply';
    } else {
      return 'Expand Replies ( ' + this.state.replyCount + ' )';
    }
  },

  viewReplies: function ( e ) {
    e.stopPropagation();
    if ( this.state.replyCount === 0 ) {
      CommentActions.newReply( this.props.comment.id );
    } else {
      AnalyticsActions.trackViewReplies( this.props.comment );
      CommentActions.showReplies( this.props.comment.id );
    }
  },

  render: function () {
    return (
      <div className="comment-component" data-key={ this.props.key }>
        <div className="row">
          <div className="small-12 column">
            <VotingBooth score={ this.state.score } userVote={ this.state.userVote } commentId={ this.props.comment.id } />
            <h6 className="author">
              { this.props.comment.author }
            </h6>
          </div>
        </div>

        <div className="row">
          <div className="small-12 column">
            <p className="content">
              { this.state.content }
            </p>
          </div>
        </div>

        <div className="comment-actions row">
          <div className="small-12 column">
            <div className="button tiny" onClick={ this.viewReplies }>
              { this.replyButtonText() }
            </div>
          </div>
        </div>


      </div>
    );
  }
});

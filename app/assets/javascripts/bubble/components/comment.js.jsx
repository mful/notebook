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

  addAnnotation: function () {
    AnalyticsActions.trackAddAnnotation();
    // stub actual functionality
  },

  replyButtonText: function () {
    if ( this.state.replyCount === 0 ) {
      return 'Reply';
    } else {
      return 'View Replies (' + this.state.replyCount + ')';
    }
  },

  viewReplies: function () {
    AnalyticsActions.trackViewReplies( this.props.comment );
    alert(
      "Well, we haven't actually built this feature yet -- we wanted to make sure people would use it. Your click has been noted :)"
    );
  },

  render: function () {
    return (
      <div className="comment-component">
        <div className="votes-wrapper">
          <VotingBooth score={ this.state.score } userVote={ this.state.userVote } commentId={ this.props.comment.id } />
        </div>

        <div className="comment-content">
          <div className="row">
            <div className="small-12 column">
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
        </div>

        <div className="comment-actions row">
          <div className="small-12 column">
            <div className="button tiny" onClick={ this.addAnnotation }>
              Add Annotation
            </div>

            <div className="button tiny" onClick={ this.viewReplies }>
              { this.replyButtonText() }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

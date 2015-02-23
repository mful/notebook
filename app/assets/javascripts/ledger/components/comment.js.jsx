/** @jsx React.DOM */

var Comment = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState: function () {
    return {
      content: this.props.comment.content,
      replyCount: this.props.comment.reply_count,
      score: this.props.comment.score,
      userVote: this.props.comment.current_user_vote
    }
  },

  componentDidMount: function () {
    CommentStore.addChangeListener( this._onChange );
  },

  componentWillUnmount: function () {
    CommentStore.removeChangeListener( this._onChange );
  },

  replyButtonText: function () {
    if ( this.state.replyCount === 0 ) {
      return 'reply';
    } else {
      return 'view replies ( ' + this.state.replyCount + ' )';
    }
  },

  typeClass: function () {
    switch ( this.props.type ) {
      case 'comment-header':
        return ' comment-header';
      case 'reply':
        return ' reply';
    }

    return '';
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

  votingBooth: function () {
    if ( this.props.type !== 'reply' )
      return <VotingBooth score={ this.state.score }
                          userVote={ this.state.userVote }
                          commentId={ this.props.comment.id } />
  },

  render: function () {
    return (
      <div className={ "comment-component" + this.typeClass() } data-key={ this.props.key }>
        <div className="row">
          <div className="small-12 column">
            { this.votingBooth() }

            <div className="avatar-wrapper"></div>

            <h6 className="author">
              { this.props.comment.author }
            </h6>
          </div>
        </div>

        <div className="row">
          <div className="small-12 column content" dangerouslySetInnerHTML={{__html: this.state.content}}>
          </div>
        </div>

        <div className="comment-actions row">
          <div className="small-12 column">
            <div className="button" onClick={ this.viewReplies }>
              { this.replyButtonText() }
            </div>
          </div>
        </div>
      </div>
    );
  },

  _onChange: function () {
    var comment = CommentStore.getById( this.props.comment.id );

    this.setState({
      content: comment.content,
      replyCount: comment.reply_count,
      score: comment.score,
      userVote: comment.current_user_vote
    });
  }
});

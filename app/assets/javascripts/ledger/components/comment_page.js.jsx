/** @jsx React.DOM */

var CommentPage = React.createClass({

  getInitialState: function () {
    if ( this.props.server_rendered ) {
      AppActions.initializeData({
        comments: this.props.replies.concat( [this.props.comment] )
      });
    }

    return this.props;
  },

  componentDidMount: function () {
    AnalyticsActions.trackViewReplies( this.props.comment );
  },

  replyList: function () {
    return <ReplyList comment={ this.state.comment }
                      replies={ this.state.replies } />
  },

  header: function () {
    return this.refs.header.getDOMNode();
  },

  submitHandler: function ( content ) {
    CommentActions.createReply({
      comment_id: this.props.comment.id,
      reply: {content: content}
    });
  },

  render: function () {
    return(
      <div className="comment-page-component">
        <nav ref="header">
          <a href={ scribble.helpers.routes.annotation_path( this.props.comment.annotation_id ) }>
            { "<< Back" }
          </a>
        </nav>

        <FormVisibilityWrapper commentList={ this.replyList() }
                               submitHandler={ this.submitHandler }
                               headerGetter={ this.header }
                               visibility={ this.props.formVisibility }
                               type={ 'reply' } />
      </div>
    );
  }
});

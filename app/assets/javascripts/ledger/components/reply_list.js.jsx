/** @jsx React.DOM */

var ReplyList = React.createClass({
  mixins: [CommentListMixin],

  getInitialState: function () {
    return {
      comment: this.props.comment,
      replies: this.props.replies
    }
  },

  render: function () {
    return (
      <div className="comment-list-component">
        <Comment comment={ this.state.comment } key={ this.state.comment.id } type={ 'comment-header' } />
        { this.collectComments( this.state.replies, 'reply' ) }
      </div>
    );
  },

  // private

  _onChange: function () {
    var replies = CommentStore.getReplies( this.props.comment.id ),
        newComment;

    newComment = this.getNewComment( this.state.replies, replies );

    if ( newComment ) {
      this.setState({
        comment: CommentStore.getById( this.props.comment.id ),
        replies: replies,
        newComment: newComment
      });
    }
  }
});

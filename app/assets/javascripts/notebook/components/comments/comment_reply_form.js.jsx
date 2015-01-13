/** @jsx React.DOM */

var CommentReplyForm = React.createClass({

  getInitialState: function () {
    return {formVisible: false}
  },

  toggleForm: function ( e ) {
    if ( typeof e !== 'undefined' ) e.preventDefault();

    return this.setState({ formVisible: !this.state.formVisible });
  },

  submitReply: function ( commentData ) {
    var data = {
      reply: commentData,
      comment_id: this.props.commentId
    }

    CommentActions.addReply( data );
    return this.toggleForm();
  },

  contents: function () {
    if ( this.state.formVisible ) {
      return <CommentForm onCommentSubmit={ this.submitReply } onCancel={ this.toggleForm } />
    } else {
      return (
        <div ref="reply-button" class="comment-reply-button">
          <p onClick={ this.toggleForm } className="button mini">
            Reply
          </p>
        </div>
      )
    }
  },

  render: function () {
    return this.contents();
  }
});

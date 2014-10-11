/** @jsx React.DOM */

var CommentForm = React.createClass({
  handleSubmit: function ( e ) {
    e.preventDefault();

    // get data
    commentData = {
      content: this.refs.content.getDOMNode().value.trim()
    };

    this.validate( commentData );
    this.props.onCommentSubmit( commentData );
    this.resetForm();
  },

  // TODO: move to store?
  // TODO: should this be server-side only?
  // TODO: need to at least check login status
  validate: function ( data ) {
    return true
  },

  resetForm: function () {
    this.refs.content.getDOMNode().value = '';
  },

  render: function () {
    // TODO: move all annotation saving logic into store, to handle diff in new/old
    return (
      <form className="comment-form" id="comment-form" onSubmit={ this.handleSubmit }>
        <textarea name="comment[content]" placeholder="What's on your mind?" ref="content"></textarea>
        <button className="post-comment button" type="submit">Post</button>  
      </form>
    )
  }
});

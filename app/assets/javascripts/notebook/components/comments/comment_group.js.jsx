/** @jsx React.DOM */

var CommentGroup = React.createClass({

  getInitialState: function () {
    return {
      comment: this.props.comment,
      replies: this.props.replies
    }
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({ replies: props.replies })
  },

  render: function () {
    var replyNodes = this.state.replies.map( function( comment ) {
      return (
        <Comment author={ comment.author }
                 content={ comment.content }
                 key={ comment.id } />
      );
    });

    return (
      <div className="comment-group">
        <Comment author={ this.state.comment.author }
                 content={ this.state.comment.content }
                 key={ this.state.comment.id }
                 allowReply={ true } />
        <div class="comment-replies">
          { replyNodes }
        </div>
      </div>
    );
  }
});

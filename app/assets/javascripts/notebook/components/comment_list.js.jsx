/** @jsx React.DOM */

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} content={comment.content} />
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

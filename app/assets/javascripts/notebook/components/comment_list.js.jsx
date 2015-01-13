/** @jsx React.DOM */

var CommentList = React.createClass({

  getInitialState: function () {
    return {comments: this.props.comments}
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({ comments: props.comments });
  },

  collectComments: function () {
    var _this = this;

    var commentNodes = this.state.comments.map( function ( comment ) {
      return (
        <CommentGroup key={ "commentGroup-" + comment.id } comment={ comment } replies={ comment.replies } />
      );
    });

    return commentNodes;
  },

  render: function () {
    return (
      <div className="commentList">
        { this.collectComments() }
      </div>
    );
  }
});

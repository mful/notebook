/** @jsx React.DOM */

var CommentList = React.createClass({
  mixins: [CommentListMixin],

  getInitialState: function () {
    return {
      comments: CommentStore.sortByRating( this.props.comments )
    }
  },

  render: function () {
    return (
      <div className="comment-list-component">
        { this.collectComments( this.state.comments, 'comment' ) }
      </div>
    );
  },

  // private

  _onChange: function () {
    var comments = CommentStore.getByAnnotationAsList( this.props.annotationId ),
        newComment;

    newComment = this.getNewComment( this.state.comments, comments );

    if ( newComment ) {
      this.setState({
        comments: CommentStore.sortByRating( comments ),
        newComment: newComment
      });
    }
  }
});

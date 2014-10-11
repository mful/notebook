/** @jsx React.DOM */

function getAnnotationState() {
  return AnnotationStore.getFirst();
}

function getCommentState() {
  return CommentStore.getAllAsList();
}

var DiscussionBox = React.createClass({
  getInitialState: function () {
    return {
      annotation: this.props.data.annotation,
      comments: this.props.data.comments
    };
  },

  handleCommentSubmit: function ( commentData ) {
    if ( typeof this.state.annotation.id === 'undefined' ) {
      this.createNew( commentData );
    } else {
      this.addComment( commentData );
    }
  },

  createNew: function ( commentData ) {
    AnnotationActions.createWithComment(
      {
        annotation: {
          text: this.props.data.annotation.text
        },
        url: this.props.data.annotation.url,
        comment: commentData
      }
    );
  },

  addComment: function ( commentData ) {
    AnnotationActions.addComment({
      annotation_id: this.state.annotation.id, 
      comment: commentData
    });
  },

  componentDidMount: function() {
    AnnotationStore.addChangeListener(this._onChange);
    CommentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AnnotationStore.removeChangeListener(this._onChange);
    CommentStore.addChangeListener(this._onChange);
  },

  render: function () {
    var highlight;

    return (
      <div className="discussion-box">

        <div className="new-comment">
          <CommentForm onCommentSubmit={ this.handleCommentSubmit } />
        </div>
        
        <HighlightText highlight={ this.state.annotation } />
        <CommentList data={ this.state.comments } />
      </div>
    );
  },

  // private

  _onChange: function() {
    this.setState({
      annotation: getAnnotationState(),
      comments: getCommentState()
    });
  }
});

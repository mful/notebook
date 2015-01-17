/** @jsx React.DOM */

var DiscussionBox = React.createClass({
  getInitialState: function () {
    return {
      annotation: this.props.data.annotation,
      comments: this.props.data.comments
    };
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({
      annotation: props.annotation,
      comments: props.comments
    })
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
          <CommentForm form={ this.props.data.form } onCommentSubmit={ this.handleCommentSubmit } />
        </div>

        <HighlightText highlight={ this.state.annotation } />
        <CommentList comments={ this.state.comments } />
        <Menu />
      </div>
    );
  },

  // private

  _onChange: function() {
    var annotation, comments;

    if ( this.state.annotation.id ) {
      annotation = AnnotationStore.getById( this.state.annotation.id );
    } else {
      annotation = AnnotationStore.getFirst();
    }
    comments = annotation.id ? CommentStore.getByAnnotationAsList( annotation.id ) : [];

    this.setState({
      annotation: annotation,
      comments: comments
    });
  }
});

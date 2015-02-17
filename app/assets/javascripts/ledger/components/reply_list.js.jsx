/** @jsx React.DOM */

var ReplyList = React.createClass({

  getInitialState: function () {
    return {
      comment: this.props.comment,
      replies: this.props.replies
    }
  },

  componentDidMount: function () {
    CommentStore.addChangeListener( this._onChange );
  },

  componentWillUnmount: function () {
    CommentStore.removeChangeListener( this._onChange );
  },

  componentDidUpdate: function () {
    var comment;

    if ( this.state.newComment ) {
      comment = document.querySelector(
        '.comment-component[data-key="' + this.state.newComment.id + '"]'
      );
      if ( comment ) comment.scrollIntoViewIfNeeded();
    }
  },

  collectReplies: function () {
    return this.state.replies.map( function ( comment ) {
      return <Comment comment={ comment } key={ comment.id } type={ 'reply' } />;
    });
  },

  render: function () {
    return (
      <div className="comment-list-component">
        <Comment comment={ this.state.comment } key={ this.state.comment.id } type={ 'comment-header' } />
        { this.collectReplies() }
      </div>
    );
  },

  // private

  _onChange: function () {
    var replies = CommentStore.getReplies( this.props.comment.id ),
        match = false, newComment, i, j;

    for( j = 0; j < replies.length; j++ ) {
      match = false;

      for( i = 0; i < this.state.replies.length; i++){
        if ( replies[j].id === this.state.replies[i].id ) {
          match = true;
          break;
        }
      }

      if ( match ) continue;

      newComment = replies[j];
      break;
    }

    this.setState({
      comment: CommentStore.getById( this.props.comment.id ),
      replies: replies,
      newComment: newComment
    });
  }
});

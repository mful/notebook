/** @jsx React.DOM */

var CommentListMixin = {

  componentDidMount: function () {
    CommentStore.addChangeListener( this._onChange );
  },

  componentDidUpdate: function () {
    var comment;

    if ( this.state.newComment ) {
      comment = document.querySelector(
        '.comment-component[data-key="' + this.state.newComment.id + '"]'
      );
      if ( comment ) {
        // to account for when the form is expanded, and the list is hidden for
        // a moment.
        setTimeout(
          function () {
            comment.scrollIntoViewIfNeeded();
          }
        ,
          100
        )
      }
    }
  },

  componentWillUnmount: function () {
    CommentStore.removeChangeListener( this._onChange );
  },

  collectComments: function ( comments, type ) {
    return comments.map( function ( comment ) {
      return <Comment comment={ comment } key={ comment.id } type={ type } />;
    });
  },

  getNewComment: function ( currentComments, newComments ) {
    var match, i, j;

    for( i = 0; i < newComments.length; i++ ) {
      match = false;

      for( j = 0; j < currentComments.length; j++ ) {
        if ( newComments[i].id === currentComments[j].id ) {
          match = true;
          break;
        }
      }

      if ( !match ) return  newComments[i];
    }

    return null;
  }
};

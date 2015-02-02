/** @jsx React.DOM */

var CommentList = React.createClass({

  getInitialState: function () {
    return {
      comments: CommentStore.sortByRating( this.props.comments )
    }
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({ comments: props.comments });
  },

  collectComments: function () {
    return this.state.comments.map( function ( comment ) {
      return <Comment comment={ comment } key={ comment.id } />;
    });
  },

  render: function () {
    return (
      <div className="comment-list-component">
        { this.collectComments() }
      </div>
    );
  }
});

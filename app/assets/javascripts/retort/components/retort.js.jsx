/** @jsx React.DOM */

var Retort = React.createClass({

  getInitialState: function () {
    if ( this.props.server_rendered ) {
      AppActions.initializeData({
        comments: this.props.replies
      });
    }

    return this.props;
  },

  addReply: function () {
    return CommentActions.newReply( this.state.parent_id );
  },

  render: function () {
    return(
      <div className="retort-component">
        <div className="button" onClick={ this.addReply }>Add Reply</div>

        <ReplyList comments={ this.state.replies } />
      </div>
    );
  }
});

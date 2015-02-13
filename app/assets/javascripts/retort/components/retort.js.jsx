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

  addReply: function ( e ) {
    e.stopPropagation();
    return CommentActions.newReply( this.state.parent_id );
  },

  postMouseup: function () {
    var event = {target: 'retort'};
    RetortCourier.post( CourierConstants.POST_MOUSEUP, {event: event} );
  },

  render: function () {
    return(
      <div className="retort-component" onClick={ this.postMouseup }>
        <div className="button" onClick={ this.addReply }>Add Reply</div>

        <ReplyList comments={ this.state.replies } />
      </div>
    );
  }
});

/** @jsx React.DOM */

var Comment = React.createClass({

  replyForm: function () {
    if ( this.props.allowReply === true ) {
      return(
        <div className="row">
          <div className="small-12 column">
            <CommentReplyForm commentId={ this.props.key } />
          </div>
        </div>
      );
    }
  },

  render: function () {
    return (
      <div className="comment-wrapper">
        <div className="row">
          <div className="small-12 column">
            <div className="votes">
              <div className="vote clickable">
                <i className="ion-arrow-up-b"></i>
              </div>

              <div className="vote clickable">
                <i className="ion-arrow-down-b"></i>
              </div>
            </div>

            <p className="username">
              { this.props.author }
            </p>

            <p className="flag clickable">
              <i className="ion-flag"></i>
            </p>
          </div>
        </div>

        <div className="row comment">
          <div className="small-12 column">
            <p>
              { this.props.content }
            </p>
          </div>
        </div>

        { this.replyForm() }
      </div>

    );
  }
});

/** @jsx React.DOM */

var Paper = React.createClass({

  getInitialState: function () {
    return this.props;
  },

  submitHandler: function ( content ) {
    if ( this.props.type === 'comment' ) {
      CommentActions.createComment({
        annotation_id: this.props.id,
        comment: {content: content}
      });
    } else if ( this.props.type === 'annotation' ) {
      AnnotationActions.createWithComment({
        annotation: {text: this.props.text},
        url: this.props.url,
        comment: {content: content}
      });
    } else if ( this.props.type === 'reply' ) {
      CommentActions.createReply({
        comment_id: this.props.id,
        reply: {content: content}
      });
    }
  },

  postMouseup: function () {
    var event = {target: 'paper'};
    PaperCourier.post( CourierConstants.POST_MOUSEUP, {event: event} );
  },

  render: function () {
    return(
      <div className="paper-component" onClick={ this.postMouseup }>
        <CommentForm submitHandler={ this.submitHandler } />
      </div>
    );
  }
});

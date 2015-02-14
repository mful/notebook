/** @jsx React.DOM */

var Paper = React.createClass({

  getInitialState: function () {
    return this.props;
  },

  componentDidMount: function () {
    switch ( this.props.type ) {
      case 'comment':
        AnalyticsActions.trackStartAnnotation( this.props.location, false );
        break;
      case 'annotation':
        AnalyticsActions.trackStartAnnotation( this.props.location, true );
        break;
      case 'reply':
        AnalyticsActions.trackStartReply( this.props.location )
        break;
    }

    scribble.helpers.analytics.trackGoogleEvent();
  },

  submitHandler: function ( content ) {
    switch( this.props.type ) {
      case 'comment':
        CommentActions.createComment({
          annotation_id: this.props.id,
          comment: {content: content}
        });
        break;
      case 'annotation':
        AnnotationActions.createWithComment({
          annotation: {text: this.props.text},
          url: this.props.url,
          comment: {content: content}
        });
        break;
      case 'reply':
        CommentActions.createReply({
          comment_id: this.props.id,
          reply: {content: content}
        });
        break;
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

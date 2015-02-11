/** @jsx React.DOM */

var Paper = React.createClass({

  getInitialState: function () {
    return this.props;
  },

  submitHandler: function ( content ) {
    if ( this.props.type === 'comment' ) {
      CommentActions.createComment({
        annotation_id: this.props.id,
        comment: {
          content: content
        }
      });
    } else if ( this.props.type === 'annotation' ) {
      AnnotationActions.createWithComment({
        annotation: {text: this.props.text},
        url: this.props.url,
        comment: {content: content}
      });
    }
  },

  render: function () {
    return(
      <div className="paper-component">
        <CommentForm submitHandler={ this.submitHandler } />
      </div>
    );
  }
});

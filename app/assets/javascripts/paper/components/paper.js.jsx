/** @jsx React.DOM */

var Paper = React.createClass({

  getInitialState: function () {
    return this.props;
  },

  submitHandler: function(content) {
    CommentActions.createComment({
      annotation_id: this.props.id,
      comment: {
        content: content
      }
    });
    return;
  },

  render: function () {
    return(
      <div className="paper-component">
        <CommentForm submitHandler={ this.submitHandler } />
      </div>
    );
  }
});

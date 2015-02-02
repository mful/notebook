/** @jsx React.DOM */

var Bubble = React.createClass({

  getInitialState: function () {
    return this.props;
  },

  render: function () {
    return (
      <div className="bubble-component">
        <CommentList comments={ this.state.comments } />
      </div>
    );
  }
});

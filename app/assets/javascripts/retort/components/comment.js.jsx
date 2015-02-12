/** @jsx React.DOM */

var Comment = React.createClass({

  getInitialState: function () {
    return {
      content: this.props.comment.content,
      score: this.props.comment.score,
      userVote: this.props.comment.current_user_vote
    }
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({
      content: props.comment.content,
      score: props.comment.score,
      userVote: props.comment.current_user_vote
    });
  },

  render: function () {
    return(
      <div className="comment-component" data-key={ this.props.key }>
        <div className="header-row">
          <div className="avatar-wrapper">
            <img />
          </div>

          <h5 className="author">
            { this.props.comment.author }
          </h5>
        </div>

        <div className="content-wrapper">
          <div className="comment-sidebar"></div>

          <p>
            { this.state.content }
          </p>
        </div>
      </div>
    )
  }
});

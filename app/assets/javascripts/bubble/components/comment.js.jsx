/** @jsx React.DOM */

var Comment = React.createClass({

  getInitialState: function () {
    return {
      content: this.props.comment.content,
      score: this.props.comment.score
    }
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({ comments: props.comments });
  },

  render: function () {
    return (
      <div className="comment-component">
        <div className="votes-wrapper">
          <VotingBooth score={ this.state.score } />
        </div>

        <div className="comment-content">
          <div className="row">
            <div className="small-12 column">
              <h6 className="author">
                { this.props.comment.author }
              </h6>
            </div>
          </div>

          <div className="row">
            <div className="small-12 column">
              <p className="content">
                { this.state.content }
              </p>
            </div>
          </div>
        </div>

        <div className="comment-actions row">
          <div className="small-12 column">
            <div className="button tiny">
              Add Annotation
            </div>

            <div className="button tiny">
              View Replies (6)
            </div>
          </div>
        </div>
      </div>
    );
  }
});

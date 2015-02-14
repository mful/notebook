/** @jsx React.DOM */

var Ledger = React.createClass({

  getInitialState: function () {
    if ( this.props.server_rendered ) {
      AppActions.initializeData({
        annotations: [this.props.annotation],
        comments: this.props.comments
      });
    }

    return this.props;
  },

  componentDidMount: function () {
    AnalyticsActions.trackAnnotationView(
      this.state.annotation,
      this.state.comments.length
    );
  },

  render: function () {
    return(
      <div className="ledger-component">
        <h1>
          <img src={ this.props.logo } />
        </h1>

        <CommentList comments= { this.state.comments } annotationId={ this.props.annotation.id } />
      </div>
    );
  }
});

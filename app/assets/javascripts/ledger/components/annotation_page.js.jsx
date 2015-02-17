/** @jsx React.DOM */

var AnnotationPage = React.createClass({

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

  commentList: function () {
    return <CommentList comments={ this.state.comments }
                        annotationId={ this.props.annotation.id } />
  },

  header: function () {
    return this.refs.header.getDOMNode();
  },

  submitHandler: function ( content ) {
    CommentActions.createComment({
      annotation_id: this.props.annotation.id,
      comment: {content: content}
    });
  },

  render: function () {
    return(
      <div className="annotation-page-component">
        <h1 ref="header">
          <img src={ this.props.logo } />
        </h1>

        <FormVisibilityWrapper commentList={ this.commentList() }
                               submitHandler={ this.submitHandler }
                               headerGetter={ this.header }
                               type={ 'comment' } />
      </div>
    );
  }
});

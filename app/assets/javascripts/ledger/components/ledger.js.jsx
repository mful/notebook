/** @jsx React.DOM */

var Ledger = React.createClass({

  getInitialState: function () {
    var state = this.props;

    if ( this.props.server_rendered ) {
      AppActions.initializeData({
        annotations: [this.props.annotation],
        comments: this.props.comments
      });
    }

    state.expaneded = false;

    return state;
  },

  componentDidMount: function () {
    AnalyticsActions.trackAnnotationView(
      this.state.annotation,
      this.state.comments.length
    );
  },

  commentList: function () {
    if ( !this.state.expanded ) {
      return <CommentList comments={ this.state.comments }
                          annotationId={ this.props.annotation.id } />
    }
  },

  expandHandler: function ( expand ) {
    this.setState({ expanded: expand });
  },

  submitHandler: function ( content ) {
    switch( this.state.submission_type ) {
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

  render: function () {
    return(
      <div className="ledger-component">
        <h1 ref="header">
          <img src={ this.props.logo } />
        </h1>

        { this.commentList() }
        <CommentForm submitHandler={ this.submitHandler }
                     expandHandler={ this.expandHandler }
                     header={ this.refs.header } />
      </div>
    );
  }
});

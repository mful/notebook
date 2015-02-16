/** @jsx React.DOM */

var Ledger = React.createClass({

  formVisibilityStates: {
    collapsed: 'collapsed',
    open: 'open',
    expanded: 'expanded'
  },

  getInitialState: function () {
    var state = this.props;

    if ( this.props.server_rendered ) {
      AppActions.initializeData({
        annotations: [this.props.annotation],
        comments: this.props.comments
      });
    }

    state.formVisibility = this.formVisibilityStates.collapsed;

    return state;
  },

  componentDidMount: function () {
    AnalyticsActions.trackAnnotationView(
      this.state.annotation,
      this.state.comments.length
    );
  },

  commentList: function () {
    if ( this.state.formVisibility !== this.formVisibilityStates.expanded ) {
      return <CommentList comments={ this.state.comments }
                          annotationId={ this.props.annotation.id } />
    }
  },

  visibilityHandler: function ( state ) {
    this.setState({ formVisibility: state });
  },

  submitHandler: function ( content ) {
    switch( this.state.submission_type ) {
      case 'comment':
        CommentActions.createComment({
          annotation_id: this.props.annotation.id,
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

  formVisibilityClass: function () {
    switch ( this.state.formVisibility ) {
      case this.formVisibilityStates.open:
        return ' form-open';
      case this.formVisibilityStates.expanded:
        return ' form-expanded';
      case this.formVisibilityStates.collapsed:
        return ' form-collapsed';
      default:
        return '';
    }
  },

  render: function () {
    return(
      <div className={ "ledger-component" + this.formVisibilityClass() }>
        <h1 ref="header">
          <img src={ this.props.logo } />
        </h1>

        { this.commentList() }
        <CommentForm submitHandler={ this.submitHandler }
                     expandHandler={ this.expandHandler }
                     header={ this.refs.header }
                     visibilityHandler={ this.visibilityHandler }
                     visibilityStates={ this.formVisibilityStates } />
      </div>
    );
  }
});

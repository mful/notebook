/** @jsx React.DOM */

var FormVisibilityWrapper = React.createClass({

  formVisibilityStates: {
    collapsed: 'collapsed',
    open: 'open',
    expanded: 'expanded'
  },

  getInitialState: function () {
    var state = this.props;
    state.formVisibility = !!this.props.visibility ?
      this.formVisibilityStates[this.props.visibility] :
      this.formVisibilityStates.collapsed;

    return state;
  },

  commentList: function () {
    if ( this.state.commentList ) return this.state.commentList;
  },

  commentListVisClass: function () {
    if ( this.state.formVisibility === this.formVisibilityStates.expanded ) {
      return ' hidden';
    } else {
      return '';
    }
  },

  visibilityHandler: function ( state ) {
    this.setState({ formVisibility: state });
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
      <div className={ "form-visibility-wrapper-component" + this.formVisibilityClass() }>

        <div className={ "comment-list-wrapper" + this.commentListVisClass() }>
          { this.state.commentList }
        </div>

        <CommentForm submitHandler={ this.props.submitHandler }
                     headerGetter={ this.props.headerGetter }
                     visibilityHandler={ this.visibilityHandler }
                     visibilityStates={ this.formVisibilityStates }
                     initialState={ this.props.visibility }
                     type={ this.props.type } />
      </div>
    );
  }
});

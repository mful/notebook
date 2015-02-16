/** @jsx React.DOM */

var CommentForm = React.createClass({

  visibilityStates: {
    collapsed: 'collapsed',
    open: 'open',
    expanded: 'expanded'
  },

  getInitialState: function () {
    return {
      visibility: this.visibilityStates.open,
      fixed: false,
      firstRender: true
    }
  },

  componentDidMount: function () {
    var boundingBox = this.refs.component.getDOMNode().getBoundingClientRect(),
        stateObj = {firstRender: false},
        _this = this;

    document.body.onmousedown = function ( e ) { _this.mouseDownE = e };
    document.body.onmouseup = function ( e ) { _this.mouseDownE = null; }

    if ( boundingBox.bottom > window.innerHeight ) {
      stateObj.fixed = true;
      stateObj.visibility = this.visibilityStates.collapsed;
    };

    this.setState( stateObj );
  },

  componentDidUpdate: function () {
    if ( this.state.visibility === this.visibilityStates.open )
      this.refs.content.getDOMNode().focus();
  },

  // event handlers

  maybeSetHeight: function () {
    if ( this.state.visibility !== this.visibilityStates.expanded ) return {};
    var header = this.props.header.getDOMNode(),
        inputMargin = 10,
        padding = 25,
        headerHeight, actionsHeight, height;

    headerHeight =  header.offsetTop + header.clientHeight
    actionsHeight = this.refs.lowerActions.getDOMNode().clientHeight * 2

    height = window.innerHeight - headerHeight - actionsHeight - inputMargin - padding;

    return {height: height + 'px'};
  },

  setOpen: function () {
    if ( this.state.visibility === this.visibilityStates.collapsed )
      this.setState({ visibility: this.visibilityStates.open })
  },

  setCollapse: function () {
    if ( this.mouseDownE && this.mouseDownE.target.className.match(/button/) ) return;
    var node = this.refs.content.getDOMNode();

    if ( this.state.fixed &&
         this.state.visibility === this.visibilityStates.open &&
         !node.value.trim()) {
      node.value = null;
      this.setState({ visibility: this.visibilityStates.collapsed })
    }
  },

  submitHandler: function ( e ) {
    e.preventDefault();
    this.props.submitHandler( this.refs.content.getDOMNode().value );
  },

  toggleExpand: function ( e ) {
    e.preventDefault();
    var visState =
      this.state.visibility === this.visibilityStates.expanded ?
        this.visibilityStates.open :
        this.visibilityStates.expanded;

    this.props.expandHandler( visState === this.visibilityStates.expanded );
    this.setState({ visibility: visState });
  },

  // render helpers

  expandBtnText: function () {
    if ( this.state.visibility === this.visibilityStates.expanded ) {
      return 'Collapse Field';
    } else {
      return 'Expand Field'
    }
  },

  textAreaPlaceholder: function () {
    return 'Write annotation here...';
  },

  visibilityClasses: function () {
    if ( this.state.firstRender ) return 'collapsed invisible';
    var classes = '';

    if ( this.state.fixed ) classes += ' fixed';

    switch ( this.state.visibility ) {
      case this.visibilityStates.collapsed:
        classes += ' collapsed';
        break;
      case this.visibilityStates.expanded:
        classes += ' expanded'
        break;
    }

    return classes;
  },

  render: function () {
    return(
      <form ref="component" className={ "comment-form-component" + this.visibilityClasses() }
                            onSubmit={ this.submitHandler }>

        <div className="actions top-actions">
          <button className="button alt-button" onClick={ this.toggleExpand }>{ this.expandBtnText() }</button>
          <input type="submit" className="button"/>
        </div>

        <textarea ref="content" ref="content" placeholder={ this.textAreaPlaceholder() }
                  onFocus={ this.setOpen }
                  style={ this.maybeSetHeight() }
                  onBlur={ this.setCollapse }></textarea>

        <div ref="lowerActions" className="actions">
          <button className="button alt-button" onClick={ this.toggleExpand }>{ this.expandBtnText() }</button>
          <input type="submit" className="button"/>
        </div>
      </form>
    );
  }
});

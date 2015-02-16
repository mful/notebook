/** @jsx React.DOM */

var CommentForm = React.createClass({

  getInitialState: function () {
    return {
      visibility: this.props.visibilityStates.open,
      fixed: false,
      firstRender: true
    }
  },

  componentDidMount: function () {
    var stateObj = {firstRender: false},
        _this = this;

    document.body.onmousedown = function ( e ) { _this.mouseDownE = e };
    document.body.onmouseup = function ( e ) { _this.mouseDownE = null; }

    CommentStore.addChangeListener( this._onChange );

    if ( this._shouldSetFixed() ) {
      stateObj.fixed = true;
      stateObj.visibility = this.props.visibilityStates.collapsed;
    };

    this.setState( stateObj );
  },

  componentDidUpdate: function () {
    if ( this.state.visibility === this.props.visibilityStates.open )
      this.refs.content.getDOMNode().focus();
  },

  componentWillUnmount: function () {
    CommentStore.removeChangeListener( this._onChange );
  },

  reset: function () {
    var textarea = this.refs.content.getDOMNode();
    textarea.value = null;
    textarea.blur();

    if ( this.state.fixed || this._shouldSetFixed() ) {
      this.setState({
        fixed: true,
        visibility: this.props.visibilityStates.collapsed
      });
    } else {
      this.setState({ visibility: this.props.visibilityStates.open });
    }

    this.props.visibilityHandler( this.state.visibility );
  },

  // event handlers

  maybeSetHeight: function () {
    if ( this.state.visibility !== this.props.visibilityStates.expanded ) return {};
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
    if ( this.state.visibility === this.props.visibilityStates.collapsed ) {
      this.setState({ visibility: this.props.visibilityStates.open });
      this.props.visibilityHandler( this.props.visibilityStates.open );
    }
  },

  setCollapse: function () {
    if ( this.mouseDownE && this.mouseDownE.target.className.match(/button/) ) return;
    var node = this.refs.content.getDOMNode();

    if ( this.state.fixed &&
         this.state.visibility === this.props.visibilityStates.open &&
         !node.value.trim()) {
      node.value = null;
      this.setState({ visibility: this.props.visibilityStates.collapsed })
      this.props.visibilityHandler( this.props.visibilityStates.collapsed );
    }
  },

  submitHandler: function ( e ) {
    e.preventDefault();
    this.props.submitHandler( this.refs.content.getDOMNode().value );
  },

  toggleExpand: function ( e ) {
    e.preventDefault();
    var visState =
      this.state.visibility === this.props.visibilityStates.expanded ?
        this.props.visibilityStates.open :
        this.props.visibilityStates.expanded;

    this.props.visibilityHandler( visState );
    this.setState({ visibility: visState });
  },

  // render helpers

  expandBtnText: function () {
    if ( this.state.visibility === this.props.visibilityStates.expanded ) {
      return 'Collapse Field';
    } else {
      return 'Expand Field'
    }
  },

  textAreaPlaceholder: function () {
    return 'Write annotation here...';
  },

  visibilityClasses: function () {
    if ( this.state.firstRender ) return ' invisible';
    var classes = '';

    if ( this.state.fixed ) classes += ' fixed';

    switch ( this.state.visibility ) {
      case this.props.visibilityStates.collapsed:
        classes += ' collapsed';
        break;
      case this.props.visibilityStates.expanded:
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
  },

  // private

  _onChange: function () {
    if ( !CommentStore.getPending() ) {
      this.reset();
    }
  },

  _shouldSetFixed: function () {
    var boundingBox = this.refs.component.getDOMNode().getBoundingClientRect();
    return boundingBox.bottom > window.innerHeight;
  }
});

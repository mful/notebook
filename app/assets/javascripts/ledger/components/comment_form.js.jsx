/** @jsx React.DOM */

var CommentForm = React.createClass({

  getInitialState: function () {
    return {
      visibility: this.props.visibilityStates.open,
      fixed: false,
      firstRender: true,
      submitted: false,
      text: ''
    }
  },

  componentDidMount: function () {
    var _this = this;

    document.body.onmousedown = function ( e ) { _this.mouseDownE = e };
    document.body.onmouseup = function ( e ) { _this.mouseDownE = null; }

    CommentStore.addChangeListener( this._onChange );

    this.setState( this.initialMountedState() );
  },

  componentWillUnmount: function () {
    CommentStore.removeChangeListener( this._onChange );
  },

  initialMountedState: function () {
    var stateObj = {firstRender: false};

    if ( this._shouldSetFixed() ) stateObj.fixed = true;

    if ( this.props.initialState ) {
      stateObj.visibility =
        this.props.visibilityStates[this.props.initialState];
    } else if ( this._shouldSetFixed() ) {
      stateObj.visibility = this.props.visibilityStates.collapsed;
    } else {
      stateObj.visibility = this.props.visibilityStates.open;
    }

    return stateObj;
  },

  reset: function () {
    var stateObj = {submitted: false, text: ''};

    this.refs.content.getDOMNode().blur();

    if ( this.state.fixed || this._shouldSetFixed() ) {
      stateObj.fixed = true;
      stateObj.visibility = this.props.visibilityStates.collapsed;
    } else {
      stateObj.visibility = this.props.visibilityStates.open;
    }

    this.setState( stateObj );
    this.props.visibilityHandler( this.state.visibility );
  },

  // event handlers

  maybeSetHeight: function () {
    if ( this.state.visibility !== this.props.visibilityStates.expanded ) return {};
    var header = this.props.headerGetter(),
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

    if ( this.state.fixed &&
         this.state.visibility === this.props.visibilityStates.open &&
         !this.refs.content.getDOMNode().value.trim()) {
      this.setState({
        visibility: this.props.visibilityStates.collapsed,
        text: ''
      });
      this.props.visibilityHandler( this.props.visibilityStates.collapsed );
    }
  },

  setStateText: function () {
    this.setState({
      text: this.refs.content.getDOMNode().value
    });
  },

  submitHandler: function ( e ) {
    e.preventDefault();
    this.setState({ submitted: true });
    this.props.submitHandler( this.state.text.trim() );
  },

  toggleExpand: function ( e ) {
    e.preventDefault();
    var visState =
      this.state.visibility === this.props.visibilityStates.expanded ?
        this.props.visibilityStates.open :
        this.props.visibilityStates.expanded;

    this.refs.content.getDOMNode().focus();
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
    var text;

    if ( this.props.type === 'reply' ) {
      text = 'Add reply here'
    } else {
      text = 'Add annotation here';
    }

    if ( this.state.visibility === this.props.visibilityStates.expanded ) {
      text += '. You can use markdown, if you like.'
    }

    return text;
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

        <textarea ref="content" placeholder={ this.textAreaPlaceholder() } id="comment_content"
                  onFocus={ this.setOpen }
                  style={ this.maybeSetHeight() }
                  onBlur={ this.setCollapse }
                  onChange={ this.setStateText }
                  value={ this.state.text }>
        </textarea>

        <div ref="lowerActions" className="actions">
          <button className="button alt-button" onClick={ this.toggleExpand }>{ this.expandBtnText() }</button>
          <input type="submit" className="button"/>
        </div>
      </form>
    );
  },

  // private

  _onChange: function () {
    if ( !CommentStore.getPending() && this.state.submitted ) {
      this.reset();
    }
  },

  _shouldSetFixed: function () {
    var boundingBox = this.refs.component.getDOMNode().getBoundingClientRect();
    return boundingBox.bottom > window.innerHeight;
  }
});

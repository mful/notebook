/** @jsx React.DOM */

var FlashComponent = React.createClass({

  getInitialState: function () {
    return {
      type: this.props.type,
      messages: this.props.messages,
      visible: this.props.visible
    }
  },

  componentWillReceiveProps: function ( props ) {
    this.setState({
      type: props.type,
      messages: props.messages,
      visible: props.visible
    });
  },

  getClasses: function () {
    var classes = this.state.type;
    if ( !this.state.visible ) classes = classes + ' hidden';

    return classes;
  },

  render: function () {
    var listItems = this.state.messages.map(function (msg) {
      return(<li>{ msg }</li>);
    });

    return(
      <div id="flash-component" className={ this.getClasses() }>
        <ul>
          { listItems }
        </ul>
      </div>
    );
  }
});

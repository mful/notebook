/** @jsx React.DOM */

var Janus = React.createClass({

  getInitialState: function () {
    return this.props;
  },

  componentDidMount: function () {
    AnalyticsActions.trackAuthStart( this.props.referringAction );
  },

  render: function () {
    return(
      <div className="janus-component">
        <LoginForm subHeader={ 'Signup to ' + this.state.referringAction } />
      </div>
    );
  }
});

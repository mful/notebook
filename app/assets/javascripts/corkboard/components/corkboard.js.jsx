/** @jsx React.DOM */

var Corkboard = React.createClass({

  getInitialState: function () {
    return {
      notifications: this.props.notifications
    };
  },

  render: function () {
    return (
      <div className="corkboard-component">
        <NotificationList notifications={ this.state.notifications } />
      </div>
    );
  }
});

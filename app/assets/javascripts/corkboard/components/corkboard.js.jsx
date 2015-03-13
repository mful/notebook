/** @jsx React.DOM */

var Corkboard = React.createClass({

  getInitialState: function () {
    if ( this.props.server_rendered ) {
      AppActions.initializeData({
        notifications: this.props.notifications
      });
    }

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

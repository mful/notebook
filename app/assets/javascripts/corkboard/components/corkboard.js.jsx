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

  logout: function () {
    SessionActions.logout();
  },

  render: function () {
    return (
      <div className="corkboard-component">
        <div className="logout-button" onClick={ this.logout }>sign out</div>
        <NotificationList notifications={ this.state.notifications } />
      </div>
    );
  }
});

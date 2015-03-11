/** @jsx React.DOM */

var NotificationList = React.createClass({

  getInitialState: function () {
    return { notifications: this.props.notifications }
  },

  collectNotifications: function () {
    return this.state.notifications.map( function ( notification ) {
      return <Notification notification={ notification }
                           key={ "notification_" + notification.id } />;
    });
  },

  render: function () {
    return (
      <div className="notification-list-component">
        <header>
          <h6 className="title">Notifications</h6>
        </header>

        <ul>
          { this.collectNotifications() }
        </ul>
      </div>
    );
  }
});

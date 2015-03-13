/** @jsx React.DOM */

var NotificationList = React.createClass({

  getInitialState: function () {
    return { notifications: this.props.notifications }
  },

  collectNotifications: function () {
    if ( this.state.notifications.length > 0 ) {
      return this.state.notifications.map( function ( notification ) {
        return <Notification notification={ notification }
                             key={ "notification_" + notification.id } />;
      });
    } else {
      return <h5 style={ {margin: '10px'} }>Huh. No notifications right now.</h5>
    }
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

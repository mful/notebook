/** @jsx React.DOM */

var Notification = React.createClass({

  getInitialState: function () {
    return {
      url: this.props.notification.url,
      message: this.props.notification.message,
      read: this.props.notification.read
    };
  },

  toggleRead: function () {
    NotificationActions.toggleRead( this.props.notification.id );
    this.setState({ read: !this.state.read });
  },

  readAndNavigate: function ( e ) {
    e.preventDefault();
    if ( !this.state.read ) this.toggleRead();
    window.open( e.currentTarget.href, '_blank' );
  },

  readClass: function () {
    return this.state.read ? ' read' : '';
  },

  readTip: function () {
    return 'Mark as ' + ( this.state.read ? 'unread' : 'read' );
  },

  render: function () {
    return(
      <li className={ "notification-component" + this.readClass() } data-key={ this.props.notification.id }>
        <a href={ this.state.url } target="_blank" onClick={ this.readAndNavigate }>
          <p dangerouslySetInnerHTML={{__html: this.state.message}}>
          </p>

          View More
        </a>

        <div className="icon-wrapper" data-tip={ this.readTip() }>
          <i className="ion-ios-circle-filled" onClick={ this.toggleRead }></i>
        </div>
      </li>
    );
  }
});

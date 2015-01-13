/** @jsx React.DOM */

var Menu = React.createClass({

  handleLogout: function () {
    SessionActions.logout();
  },

  render: function () {
    return(
      <button onClick={ this.handleLogout }>logout</button>
    );
  }
});

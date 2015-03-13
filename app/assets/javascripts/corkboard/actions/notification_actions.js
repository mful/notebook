var NotificationActions = {

  toggleRead: function ( id ) {
    AppDispatcher.handleViewAction({
      actionType: NotificationConstants.TOGGLE_READ,
      data: {id: id}
    });
  }
};

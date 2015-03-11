var SessionActions = {
  requestLogin: function () {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.AUTH_NEEDED,
      data: {}
    });
  }
};

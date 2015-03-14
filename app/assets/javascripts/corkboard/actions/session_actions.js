var SessionActions = {

  logout: function () {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.LOGOUT,
      data: {}
    });
  },

  requestLogin: function () {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.AUTH_NEEDED,
      data: {}
    });
  }
};

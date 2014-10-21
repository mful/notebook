var SessionActions = {

  logout: function () {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.LOGOUT,
      data: {}
    });
  },

  fbLogin: function () {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.FB_LOGIN,
      data: {}
    });
  },

  googleLogin: function () {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.GOOGLE_LOGIN,
      data: {}
    });
  },

  notifyLogin: function () {
    AppDispatcher.handleStoreRequest({
      actionType: SessionConstants.LOGIN_SUCCESS,
      data: {}
    })
  },

  notifyLogout: function () {
    AppDispatcher.handleStoreRequest({
      actionType: SessionConstants.LOGOUT_SUCCESS,
      data: {}
    })
  }
}

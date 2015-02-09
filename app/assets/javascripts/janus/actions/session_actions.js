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

  emailLogin: function ( loginInfo ) {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.EMAIL_LOGIN,
      data: loginInfo
    })
  },

  createUserWithEmail: function ( userInfo ) {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.CREATE_USER_WITH_EMAIL,
      data: userInfo
    })
  },

  updateCurrentUser: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: SessionConstants.UPDATE_CURRENT_USER,
      data: data
    });
  },

  notifyLogin: function () {
    AppDispatcher.handleStoreRequest({
      actionType: SessionConstants.LOGIN_SUCCESS,
      data: {}
    });
  },

  notifyLogout: function () {
    AppDispatcher.handleStoreRequest({
      actionType: SessionConstants.LOGOUT_SUCCESS,
      data: {}
    })
  }
}

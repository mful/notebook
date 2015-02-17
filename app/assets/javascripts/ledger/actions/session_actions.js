var SessionActions = {

  notifyAuthNeeded: function ( referringAction ) {
    AppDispatcher.handleStoreRequest({
      actionType: SessionConstants.AUTH_NEEDED,
      data: referringAction
    });
  },

  notifyLogin: function () {
    AppDispatcher.handleStoreRequest({
      actionType: SessionConstants.LOGIN_SUCCESS,
      data: {}
    });
  }
}

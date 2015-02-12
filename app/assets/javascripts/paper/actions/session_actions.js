var SessionActions = {

  notifyLogin: function () {
    AppDispatcher.handleStoreRequest({
      actionType: SessionConstants.LOGIN_SUCCESS,
      data: {}
    });
  }
}

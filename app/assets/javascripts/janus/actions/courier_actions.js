var CourierActions = {

  dispatch: function ( messageData ) {
    AppDispatcher.handleStoreRequest({
      actionType: messageData.message,
      data: messageData.data
    });
  },

  postLogin: function ( user ) {
    AppDispatcher.handleStoreRequest({
      actionType: CourierConstants.POST_LOGIN,
      data: { currentUser: user }
    });
  },
}
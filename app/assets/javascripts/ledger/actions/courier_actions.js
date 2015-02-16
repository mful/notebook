var CourierActions = {

  dispatch: function ( messageData ) {
    AppDispatcher.handleStoreRequest({
      actionType: messageData.message,
      data: messageData.data
    });
  }
};

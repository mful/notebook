var ModalActions = {

  dismiss: function () {
    AppDispatcher.handleViewAction({
      actionType: ModalConstants.CLOSE_MODAL,
      data: {}
    });
  }
}

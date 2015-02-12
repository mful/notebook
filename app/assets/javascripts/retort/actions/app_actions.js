var AppActions = {

  initializeData: function ( data ) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.INITIALIZE_DATA,
      data: data
    })
  }
}

var UserActions = {

  fetchNameMatches: function ( text ) {
    AppDispatcher.handleViewAction({
      actionType: UserConstants.AT_MENTION,
      data: {text: text}
    });
  }
};

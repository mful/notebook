var RetortCourier = React.addons.update(Courier, {$merge: {

  dispatchToken: AppDispatcher.register( function ( payload ) {
    var action = payload.action;

    // stub

    return true;
  })
}});

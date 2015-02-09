var Dispatcher = require('flux/Flux').Dispatcher;

var AppDispatcher = React.addons.update(Dispatcher.prototype, {$merge: {

  /**
   * A bridge function between the views and the dispatcher, marking the action
   * as a view action.  Another variant here could be handleServerAction.
   * @param {object} action The data coming from the view.
   */
  handleViewAction: function ( action ) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  handleStoreRequest: function ( action ) {
    this.dispatch({
      source: 'STORE_ACTION',
      action: action
    });
  }

}});

//= require_self

//= require ../shared/helpers/analytics
//= require ../shared/helpers/routes
//= require ../shared/helpers/url
//= require ../shared/helpers/xhr
//= require_tree ../shared/constants
//= require_tree ../shared/dispatchers
//= require ../shared/mediators/courier
//= require_tree ../shared/stores
//= require_tree ./components
//= require_tree ./actions
//= require_tree ./mediators
//= require_tree ./routers

window.ledger = {};
window.scribble = {};
scribble.helpers = {};

ledger.init = function () {
  SessionStore.initialize();
  LedgerCourier.initialize();
  ledger.router = new LedgerRouter();
  ledger.bindRoutingEvents();

  return this;
}

ledger.bindRoutingEvents = function () {
  var navHandler = function ( e ) {
    if ( e.target.tagName === 'A' ) {
      e.preventDefault();
      ledger.router.navigate(
        e.target.getAttribute( 'href' ),
        {trigger: true}
      );
    }
  }

  document.body.addEventListener( 'click', navHandler );
};

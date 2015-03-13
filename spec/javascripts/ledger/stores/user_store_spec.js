//= require_self

//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require shared/helpers/routes
//= require shared/helpers/xhr
//= require_tree ../../../../app/assets/javascripts/shared/constants

//= require ledger/stores/user_store

window.scribble || ( window.scribble = {} );

describe( 'UserStore', function () {

  describe( '#getNameMatches', function () {

    var users = [
      {id: 1, username: 'hagrid'},
      {id: 2, username: 'harry'}
    ]

    beforeEach( function () {
      spyOn( UserStore, 'emitChange' );
      spyOn( scribble.helpers.xhr, 'get' ).and.callFake( function ( url, func ) {
        func( null, {status: 200, data: {users: users}} );
      });

      AppDispatcher.handleViewAction({
        actionType: UserConstants.AT_MENTION,
        data: {text: 'ha'}
      });
    });

    it( 'should set the _atMentionUsers private variable', function () {
      expect( UserStore.atMentionUsers() ).toEqual( users );
    });

    it( 'should emit a change', function () {
      expect( UserStore.emitChange ).toHaveBeenCalled();
    });
  });
});

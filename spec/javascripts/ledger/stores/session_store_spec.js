//= require_self

//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require shared/mediators/courier
//= require_tree ../../../../app/assets/javascripts/shared/constants

//= require ledger/mediators/ledger_courier
//= require ledger/actions/session_actions
//= require ledger/stores/session_store

describe( 'SessionStore', function () {

  beforeEach( function () {
    SessionStore.reset();
  });

  describe( '#initialize', function () {

    describe( 'when the session store has already been initialized', function () {

      beforeEach( function () {
        SessionStore.initialized = true;
      });

      it( 'should return true', function () {
        expect( SessionStore.initialize() ).toEqual( true );
      });
    });

    describe( 'when there is a bootstrapped user', function () {
      var user = {};

      beforeEach( function () {
        window.scribble_bootstrap = {current_user: {user: user}};
        SessionStore.initialized = false;

        SessionStore.initialize();
      });

      it( 'should set the current user', function () {
        expect( SessionStore.currentUser() ).toEqual( user );
      });

      it( 'should set the initialized flag on the store', function () {
        expect( SessionStore.initialized ).toEqual( true );
      });
    });

    describe( 'when there is not a bootstrapped user', function () {

      beforeEach( function () {
        window.scribble_bootstrap = {current_user: null};
        SessionStore.initialized = false;

        SessionStore.initialize();
      });

      it( 'should set the initialized flag on the store', function () {
        expect( SessionStore.initialized ).toEqual( true );
      });
    });
  });

  describe( '#isCurrentUserComplete', function () {

    describe( 'when there is a current user', function () {

      describe( 'but that user does not have a username', function () {
        var user = {username: null};

        beforeEach( function () {
          window.scribble_bootstrap = {current_user: {user: user}};
          SessionStore.initialized = false;

          SessionStore.initialize();
        });

        it( 'should return false', function () {
          expect( SessionStore.isCurrentUserComplete() ).toEqual( false );
        });
      });

      describe( 'but that username is an empty string', function () {
        var user = {username: '     '};

        beforeEach( function () {
          window.scribble_bootstrap = {current_user: {user: user}};
          SessionStore.initialized = false;

          SessionStore.initialize();
        });

        it( 'should return false', function () {
          expect( SessionStore.isCurrentUserComplete() ).toEqual( false );
        });
      });

      describe( 'and that user has a username', function () {
        var user = {username: 'mattmattmatt'};

        beforeEach( function () {
          window.scribble_bootstrap = {current_user: {user: user}};
          SessionStore.initialized = false;

          SessionStore.initialize();
        });

        it( 'should return false', function () {
          expect( SessionStore.isCurrentUserComplete() ).toEqual( true );
        });
      });
    });

    describe( 'when there is not a current user', function () {
      it( 'should return false', function () {
        expect( SessionStore.isCurrentUserComplete() ).toEqual( false );
      });
    });
  });

  describe( '#_ensureCurrentUser', function () {

    beforeEach( function () {
      spyOn( LedgerCourier, 'post' );
    });

    describe( 'when the current user is complete', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( true );
        SessionStore._ensureCurrentUser();
      });

      it( 'should not request login', function () {
        expect( LedgerCourier.post ).not.toHaveBeenCalled();
      });
    });

    describe( 'when the current user is NOT complete', function () {

      beforeEach( function () {
        spyOn( SessionStore, 'isCurrentUserComplete' ).and.returnValue( false );
        SessionStore._ensureCurrentUser();
      });

      it( 'should not request login', function () {
        expect( LedgerCourier.post ).toHaveBeenCalled();
      });
    });
  });

  describe( '#_setCurrentUser', function () {
    var user = {};

    beforeEach( function () {
      spyOn( AppDispatcher, 'handleStoreRequest' );
      spyOn( SessionStore, 'emitChange' );

      SessionStore._setCurrentUser( user );
    });

    it( 'should set the current user', function () {
      expect( SessionStore.currentUser() ).toEqual( user );
    });

    it( 'should notify a successful login', function () {
      expect( AppDispatcher.handleStoreRequest ).toHaveBeenCalledWith({
        actionType: 'login',
        data: {}
      });
    });

    it( 'should emit a change', function () {
      expect( SessionStore.emitChange ).toHaveBeenCalled();
    });
  });

});

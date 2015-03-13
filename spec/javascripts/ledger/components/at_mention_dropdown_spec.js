//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require shared/helpers/utility
//= require shared/helpers/xhr

//= require ledger/services/textarea_caret_position_service
//= require ledger/actions/user_actions
//= require ledger/stores/user_store
//= require ledger/components/at_mention_dropdown

window.scribble || ( window.scribble = {} );

describe( 'AtMentionDropdown', function () {

  var users = [
        {id: 1, username: 'mattmattmatt'},
        {id: 2, username: 'matilda'}
      ],
      instance, container, contentNode, props;

  beforeEach( function () {
    container = document.createElement( 'div' );
    contentNode = document.createElement( 'textarea' );
    container.appendChild( contentNode );
    document.body.appendChild( container );
    props = {
      text: '@ma',
      contentNode: contentNode,
      atMentionHandler: function () {}
    }
  });

  afterEach( function() {
    if ( instance && instance.isMounted() ) {
      // Only components with a parent will be unmounted
      React.unmountComponentAtNode( instance.getDOMNode().parentElement );
      instance = null;
    }
    document.body.removeChild( container );
    container = null;
  });

  describe( 'initial state', function () {

    beforeEach( function () {
      spyOn( UserActions, 'fetchNameMatches' ).and.callFake( function ( text, func ) {
        func( users );
      });

      instance = React.renderComponent( AtMentionDropdown(props), container );
    });

    it( 'should fetch user search results', function () {
      expect( instance.state.users ).toEqual( users );
    });

    it( 'should un-hide the component', function () {
      expect( instance.refs.component.getDOMNode().style.visibility ).toEqual( 'visible' );
    });

    it( 'should strip the @ from the text', function () {
      expect( instance.state.text ).toEqual( 'ma' );
    });
  });

  describe( '#componentDidUpdate', function () {

    beforeEach( function () {
      instance = React.renderComponent( AtMentionDropdown(props), container );
      spyOn( instance, 'setPosition' );

      instance.componentDidUpdate();
    });

    it( 'should set the position of the dropdown', function () {
      expect( instance.setPosition ).toHaveBeenCalled();
    });
  });

  describe( '#componentWillReceiveProps', function () {

    describe( 'when the given text is the same as the current text', function () {

      beforeEach( function () {
        instance = React.renderComponent( AtMentionDropdown(props), container );

        spyOn( instance, 'debouncedFetchUser' );
        spyOn( instance, 'setState' );

        instance.componentWillReceiveProps({ text: props.text });
      });

      it( 'should not fetch users', function () {
        expect( instance.debouncedFetchUser ).not.toHaveBeenCalled();
      });

      it( 'should not update the component state', function () {
        expect( instance.setState ).not.toHaveBeenCalled();
      });
    });

    describe( 'when given fresh text', function () {
      beforeEach( function () {
        instance = React.renderComponent( AtMentionDropdown(props), container );

        spyOn( instance, 'debouncedFetchUser' );
        spyOn( instance, 'setState' );

        instance.componentWillReceiveProps({ text: '@joh' });
      });

      it( 'should fetch new user results', function () {
        expect( instance.debouncedFetchUser ).toHaveBeenCalled();
      });

      it( 'should update the component state', function () {
        expect( instance.setState ).toHaveBeenCalledWith({ text: 'joh' });
      });
    });
  });

  describe( '#completeMention', function () {

    beforeEach( function () {
      spyOn( UserActions, 'fetchNameMatches' ).and.callFake( function ( text, func ) {
        func( users );
      });

      instance = React.renderComponent( AtMentionDropdown(props), container );

      spyOn( instance.props, 'atMentionHandler' );

      var li = instance.refs.component.getDOMNode().querySelector( 'li' );
      React.addons.TestUtils.Simulate.click( li );
    });

    it( 'should delegate to the given handler, passing the username', function () {
      expect( instance.props.atMentionHandler ).toHaveBeenCalledWith( '@mattmattmatt' );
    });
  });

  describe( '#setPosition', function () {

    var positionService = {get: function () {}};

    beforeEach( function () {
      spyOn( UserActions, 'fetchNameMatches' ).and.callFake( function ( text, func ) {
        func( users );
      });

      instance = React.renderComponent( AtMentionDropdown(props), container );
      spyOn( window, 'TextareaCaretPositionService' ).and.returnValue( positionService );
    });

    describe( 'when the dropdown would fall off the screen', function () {

      beforeEach( function () {
        spyOn( positionService, 'get' ).and.returnValue({ top: 10000 });

        this.node = instance.refs.component.getDOMNode();

        var clientHeight = this.node.clientHeight,
            lineHeight = getComputedStyle( contentNode )['lineHeight'] || 0;

        this.expectedResult = 10000 - clientHeight - parseInt( lineHeight ) + 'px';

        instance.setPosition();
      });

      it( 'should set the top position of the component to be just above the cursor', function () {
        expect( this.node.style.top ).toEqual( this.expectedResult );
      });
    });

    describe( 'when the dropdown will not fall off the league', function () {

      beforeEach( function () {
        spyOn( positionService, 'get' ).and.returnValue({ top: 1 });

        this.node = instance.refs.component.getDOMNode();

        var lineHeight = getComputedStyle( contentNode )['lineHeight'] || 0;

        this.expectedResult = 1 + parseInt( lineHeight ) + 'px';

        instance.setPosition();
      });

      it( 'should set the top position of the component to be just above the cursor', function () {
        expect( this.node.style.top ).toEqual( this.expectedResult );
      });
    });
  });

  describe( '#userListItems', function () {

    beforeEach( function () {
      instance = React.renderComponent( AtMentionDropdown(props), container );
    });

    describe( 'when there are username results', function () {

      beforeEach( function () {
        instance.state.users = users;
      });

      it( 'should return a list item for each username result', function () {
        expect( instance.userListItems().length ).toEqual( 2 );
      });
    });

    describe( 'when there is no text', function () {

      beforeEach( function () {
        instance.state.text = '';
      });

      it( 'should return null', function () {
        expect( instance.userListItems()).toEqual( null );
      });
    });

    describe( 'when the initial search has not yet completed', function () {
      beforeEach( function () {
        instance.state.users = null;
        this.results = instance.userListItems()
      });

      it( 'should return a list item explaining that the app is searching', function () {
        expect( this.results.props.children ).toEqual( 'searching...' );
      });
    });

    describe( 'when no user results are found', function () {

      beforeEach( function () {
        instance.state.users = [];
        this.results = instance.userListItems()
      });

      it( 'should return a list item explaining that no users could be found', function () {
        expect( this.results.props.children ).toEqual( 'No users found :(' );
      });
    });
  });

  describe( '#_fetchUser', function () {

    beforeEach( function () {
      instance = React.renderComponent( AtMentionDropdown(props), container );

      spyOn( scribble.helpers.xhr, 'get' ).and.callFake( function ( url, func ) {
        func( null, {status: 200, data: {users: users}} )
      });
      spyOn( instance, 'setState' );

      instance._fetchUser( 'mat' );
    });

    it( 'should set the state, with the given users', function () {
      expect( instance.setState ).toHaveBeenCalledWith({ users: users });
    });
  });

});

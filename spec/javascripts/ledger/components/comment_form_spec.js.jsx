//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require ledger/stores/comment_store
//= require ledger/components/comment_form

describe( 'CommentForm', function () {

  var instance,
      container,
      props = {
        headerGetter: function () { return {offsetTop: 10, clientHeight: 20}; },
        visibilityHandler: function () {},
        submitHandler: function () {},
        visibilityStates: {
          collapsed: 'collapsed',
          open: 'open',
          expanded: 'expanded'
        },
        type: 'comment'
      };

  beforeEach( function () {
    container = document.createElement("div");
    document.body.appendChild( container );
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

    describe( 'when given an initial visibility state mandate', function () {

      beforeEach( function () {
        visProps = {
          headerGetter: function () { return {offsetTop: 10, clientHeight: 20}; },
          visibilityStates: {
            collapsed: 'collapsed',
            open: 'open',
            expanded: 'expanded'
          },
          initialState: 'open'
        };
        instance = React.renderComponent( CommentForm(visProps), container );
      });

      describe( 'and the form should be fixed to the bottom of the view', function () {

        beforeEach( function () {
          spyOn( instance, '_shouldSetFixed' ).and.returnValue( true );
          instance.componentDidMount();
        });

        it( 'should set the form visiibility to that state', function () {
          expect( instance.state.visibility ).toEqual( 'open' );
        });

        it( 'should fix the form to the bottom of the view', function () {
          expect( instance.state.fixed ).toEqual( true );
        });
      });

      describe( 'and the form should float, open, under the last comment', function () {

        beforeEach( function () {
          spyOn( instance, '_shouldSetFixed' ).and.returnValue( false );
          instance.componentDidMount();
        });

        it( 'should set the form visiibility to that state', function () {
          expect( instance.state.visibility ).toEqual( 'open' );
        });

        it( 'should NOT fix the form to the bottom of the view', function () {
          expect( instance.state.fixed ).toEqual( false );
        });
      });
    });

    describe( 'when NOT given an initial visibility state mandate', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
      });

      describe( 'and the form should be fixed to the bottom of the view', function () {

        beforeEach( function () {
          spyOn( instance, '_shouldSetFixed' ).and.returnValue( true );
          instance.componentDidMount();
        });

        it( 'should set the form visiibility to collapsed', function () {
          expect( instance.state.visibility ).toEqual( 'collapsed' );
        });

        it( 'should fix the form to the bottom of the view', function () {
          expect( instance.state.fixed ).toEqual( true );
        });
      });

      describe( 'and the form should float, open, under the last comment', function () {

        beforeEach( function () {
          spyOn( instance, '_shouldSetFixed' ).and.returnValue( false );
          instance.componentDidMount();
        });

        it( 'should set the form visiibility to open', function () {
          expect( instance.state.visibility ).toEqual( 'open' );
        });

        it( 'should NOT fix the form to the bottom of the view', function () {
          expect( instance.state.fixed ).toEqual( false );
        });
      });
    });
  });

  describe( '#reset', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentForm(props), container );
    });

    describe( 'when the form is fixed to the bottom of the view', function () {

      beforeEach( function () {
        instance.setState({
          text: 'this is some text',
          fixed: true,
          visibility: 'open'
        });

        instance.reset();
      });

      it( 'should reset the state', function () {
        expect( instance.state ).toEqual({
          visibility: 'collapsed',
          fixed: true,
          firstRender: false,
          submitted: false,
          text: ''
        })
      });
    });

    describe( 'when the form is not fixed, but it should be', function () {

      beforeEach( function () {
        instance.setState({
          text: 'this is some text',
          fixed: false,
          visibility: 'open'
        });

        spyOn( instance, '_shouldSetFixed' ).and.returnValue( true );

        instance.reset();
      });

      it( 'should reset the state', function () {
        expect( instance.state ).toEqual({
          visibility: 'collapsed',
          fixed: true,
          firstRender: false,
          submitted: false,
          text: ''
        })
      });
    });

    describe( 'when the form is neither fixed, nor should it be', function () {

      beforeEach( function () {
        instance.setState({
          text: 'this is some text',
          fixed: false,
          visibility: 'open'
        });

        spyOn( instance, '_shouldSetFixed' ).and.returnValue( false );

        instance.reset();
      });

      it( 'should reset the state', function () {
        expect( instance.state ).toEqual({
          visibility: 'open',
          fixed: false,
          firstRender: false,
          submitted: false,
          text: ''
        })
      });
    });
  });

  describe( '#maybeSetHeight', function () {

    describe( 'when expanded', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
        instance.setState({ visibility: 'expanded' });

        var windowHeight = window.innerHeight,
            actionsHeight = instance.refs.lowerActions.getDOMNode().clientHeight;

        this.height = windowHeight - 30 - ( actionsHeight * 2 ) - 35;
      });

      it( 'should return an object with the pixel height specified', function () {
        expect( instance.maybeSetHeight() ).toEqual({ height: this.height + 'px' })
      });
    });

    describe( 'when NOT expanded', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
      });

      it( 'should return an empty object', function () {
        expect( instance.maybeSetHeight() ).toEqual( {} );
      });
    });
  });

  describe( '#setOpen', function () {

    describe( 'when the CommentForm is collapsed', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
        instance.setState({ visibility: 'collapsed' });

        spyOn( instance.props, 'visibilityHandler' );

        React.addons.TestUtils.Simulate.focus( instance.refs.content.getDOMNode() );
      });

      it( 'should set the visibility to open', function () {
        expect( instance.state.visibility ).toEqual( 'open' );
      });

      it( 'should delegate to the visibility handler', function () {
        expect( instance.props.visibilityHandler ).toHaveBeenCalled();
      });
    });
  });

  describe( '#setCollapsed', function () {

    describe( 'when triggered by clicking a button', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
        instance.setState({ visibility: 'open', text: '    ', fixed: true });

        spyOn( instance.props, 'visibilityHandler' );

        React.addons.TestUtils.Simulate.focus( instance.refs.content.getDOMNode() );
        React.addons.TestUtils.Simulate.click( instance.refs.lowerActions.getDOMNode().querySelector('input') );
      });

      it( 'should not change the state', function () {
        expect( instance.state.visibility ).toEqual( 'open' );
      });

      it( 'should not reset the text', function () {
        expect( instance.state.text ).toEqual( '    ' );
      });

      it( 'should not call the visibilityHandler', function () {
        expect( instance.props.visibilityHandler ).not.toHaveBeenCalled();
      });
    });

    describe( 'when the form is fixed, open, and textarea without content', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
        instance.setState({ visibility: 'open', text: '    ', fixed: true });

        spyOn( instance.props, 'visibilityHandler' );

        React.addons.TestUtils.Simulate.blur( instance.refs.content.getDOMNode() );
      });

      it( 'should set the visibility to collapsed', function () {
        expect( instance.state.visibility ).toEqual( 'collapsed' );
      });

      it( 'should reset the text', function () {
        expect( instance.state.text ).toEqual( '' );
      });

      it( 'should delegate to the visibility handler', function () {
        expect( instance.props.visibilityHandler ).toHaveBeenCalled();
      });
    });

    describe( 'when the form has valid text in it', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
        instance.setState({ visibility: 'open', text: 'Some text', fixed: true });

        spyOn( instance.props, 'visibilityHandler' );

        React.addons.TestUtils.Simulate.blur( instance.refs.content.getDOMNode() );
      });

      it( 'should not change the state', function () {
        expect( instance.state.visibility ).toEqual( 'open' );
      });

      it( 'should not reset the text', function () {
        expect( instance.state.text ).toEqual( 'Some text' );
      });

      it( 'should not call the visibilityHandler', function () {
        expect( instance.props.visibilityHandler ).not.toHaveBeenCalled();
      });
    });

    describe( 'when the form is not fixed', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
        instance.setState({ visibility: 'open', text: '   ', fixed: false });

        spyOn( instance.props, 'visibilityHandler' );

        React.addons.TestUtils.Simulate.blur( instance.refs.content.getDOMNode() );
      });

      it( 'should not change the state', function () {
        expect( instance.state.visibility ).toEqual( 'open' );
      });

      it( 'should not reset the text', function () {
        expect( instance.state.text ).toEqual( '   ' );
      });

      it( 'should not call the visibilityHandler', function () {
        expect( instance.props.visibilityHandler ).not.toHaveBeenCalled();
      });
    });

    describe( 'when the form is expanded', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
        instance.setState({ visibility: 'expanded', text: '   ', fixed: true });

        spyOn( instance.props, 'visibilityHandler' );

        React.addons.TestUtils.Simulate.blur( instance.refs.content.getDOMNode() );
      });

      it( 'should not change the state', function () {
        expect( instance.state.visibility ).toEqual( 'expanded' );
      });

      it( 'should not reset the text', function () {
        expect( instance.state.text ).toEqual( '   ' );
      });

      it( 'should not call the visibilityHandler', function () {
        expect( instance.props.visibilityHandler ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '#submitHandler', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentForm(props), container );
      instance.setState({ text: 'Some text!' });

      spyOn( instance.props, 'submitHandler' );

      React.addons.TestUtils.Simulate.submit( instance.refs.component.getDOMNode() );
    });

    it( 'should set the state to submitted', function () {
      expect( instance.state.submitted ).toEqual( true );
    });

    it( 'should delegate to the submitHandler', function () {
      expect( instance.props.submitHandler ).toHaveBeenCalledWith(
        'Some text!'
      );
    });
  });

  describe( '#toggleExpand', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentForm(props), container );
    });

    describe( 'when already expanded', function () {

      beforeEach( function () {
        instance.setState({ visibility: 'expanded' });

        spyOn( instance.refs.content.getDOMNode(), 'focus' );
        spyOn( instance.props, 'visibilityHandler' );

        React.addons.TestUtils.Simulate.click( instance.refs.lowerActions.getDOMNode().querySelector('button') );
      });

      it( 'should set the visibility to open', function () {
        expect( instance.state.visibility ).toEqual( 'open' );
      });

      it( 'should delegate to the visibilityHandler', function () {
        expect( instance.props.visibilityHandler ).toHaveBeenCalledWith( 'open' );
      });

      it( 'should focus on the textarea', function () {
        expect( instance.refs.content.getDOMNode().focus ).toHaveBeenCalled();
      });
    });

    describe( 'when the form is open but not expanded', function () {

      beforeEach( function () {
        instance.setState({ visibility: 'open' });

        spyOn( instance.refs.content.getDOMNode(), 'focus' );
        spyOn( instance.props, 'visibilityHandler' );

        React.addons.TestUtils.Simulate.click( instance.refs.lowerActions.getDOMNode().querySelector('button') );
      });

      it( 'should set the visibility to expanded', function () {
        expect( instance.state.visibility ).toEqual( 'expanded' );
      });

      it( 'should delegate to the visibilityHandler', function () {
        expect( instance.props.visibilityHandler ).toHaveBeenCalledWith( 'expanded' );
      });

      it( 'should focus on the textarea', function () {
        expect( instance.refs.content.getDOMNode().focus ).toHaveBeenCalled();
      });
    });
  });

  describe( '#expandBtnText', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentForm(props), container );
    });

    describe( 'when the form is already expanded', function () {

      beforeEach( function () {
        instance.setState({ visibility: 'expanded' });
      });

      it( 'should return the CTA to collapse the field', function () {
        expect( instance.expandBtnText() ).toEqual( 'Collapse Field' );
      });
    });

    describe( 'when the form is open, but not expanded', function () {

      beforeEach( function () {
        instance.setState({ visibility: 'open' });
      });

      it( 'should return the CTA to expand the field', function () {
        expect( instance.expandBtnText() ).toEqual( 'Expand Field' );
      });
    });
  });

  describe( '#textAreaPlaceholder', function () {

    describe( 'when writing an annotation', function () {

      beforeEach( function () {
        instance = React.renderComponent( CommentForm(props), container );
      });

      it( 'should return the proper CTA', function () {
        expect( instance.textAreaPlaceholder() ).toEqual( 'Add annotation here' );
      });

      describe( 'and the form is expanded', function () {

        beforeEach( function () {
          instance.setState({ visibility: 'expanded' });
        });

        it( 'should return the CTA, with a hint to use MD', function () {
          expect( instance.textAreaPlaceholder() ).toEqual( 'Add annotation here. You can use markdown, if you like.' );
        });
      });
    });

    describe( 'when writing a reply', function () {

      beforeEach( function () {
        var replyProps = {
          headerGetter: function () { return {offsetTop: 10, clientHeight: 20}; },
          visibilityHandler: function () {},
          submitHandler: function () {},
          visibilityStates: {
            collapsed: 'collapsed',
            open: 'open',
            expanded: 'expanded'
          },
          type: 'reply'
        }
        instance = React.renderComponent( CommentForm(replyProps), container );
      });

      it( 'should return the proper CTA', function () {
        expect( instance.textAreaPlaceholder() ).toEqual( 'Add reply here' );
      });

      describe( 'and the form is expanded', function () {

        beforeEach( function () {
          instance.setState({ visibility: 'expanded' });
        });

        it( 'should return the CTA, with a hint to use MD', function () {
          expect( instance.textAreaPlaceholder() ).toEqual( 'Add reply here. You can use markdown, if you like.' );
        });
      });
    });
  });

  describe( '#visiibilityClasses', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentForm(props), container );
    });

    describe( 'on first render', function () {

      beforeEach( function () {
        instance.state.firstRender = true;
      });

      it( 'should return the class to hide the form, with the prepended space', function () {
        expect( instance.visibilityClasses() ).toEqual( ' invisible' );
      });
    });

    describe( 'when collapsed', function () {

      beforeEach( function () {
        instance.setState({ visibility: 'collapsed', fixed: false })
      });

      it( 'should return the collapsed class, with a prepended space', function () {
        expect( instance.visibilityClasses() ).toEqual( ' collapsed' );
      });

      describe( 'and fixed', function () {

        beforeEach( function () {
          instance.setState({ fixed: true });
        });

        it( 'should return the collapsed and fixed classes, with a prepended space', function () {
          expect( instance.visibilityClasses() ).toEqual( ' fixed collapsed' );
        });
      });
    });

    describe( 'when expanded', function () {
      beforeEach( function () {
        instance.setState({ visibility: 'expanded', fixed: false })
      });

      it( 'should return the expanded class, with a prepended space', function () {
        expect( instance.visibilityClasses() ).toEqual( ' expanded' );
      });

      describe( 'and fixed', function () {

        beforeEach( function () {
          instance.setState({ fixed: true });
        });

        it( 'should return the expanded and fixed classes, with a prepended space', function () {
          expect( instance.visibilityClasses() ).toEqual( ' fixed expanded' );
        });
      });
    });

    describe( 'when open', function () {
      beforeEach( function () {
        instance.setState({ visibility: 'open', fixed: false })
      });

      it( 'should return an empty string', function () {
        expect( instance.visibilityClasses() ).toEqual( '' );
      });

      describe( 'and fixed', function () {

        beforeEach( function () {
          instance.setState({ fixed: true });
        });

        it( 'should return the fixed class, with a prepended space', function () {
          expect( instance.visibilityClasses() ).toEqual( ' fixed' );
        });
      });
    });
  });

  describe( '#_onChange', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentForm(props), container );
      spyOn( instance, 'reset' );
    });

    describe( 'when there is no pending comment, and the form has been submitted', function () {

      beforeEach( function () {
        spyOn( CommentStore, 'getPending' ).and.returnValue( null );
        instance.setState({ submitted: true });

        instance._onChange();
      });

      it( 'should reset the form', function () {
        expect( instance.reset ).toHaveBeenCalled();
      });
    });

    describe( 'when there is a pending comment, and the form has been submitted', function () {

      beforeEach( function () {
        spyOn( CommentStore, 'getPending' ).and.returnValue( {} );
        instance.setState({ submitted: true });

        instance._onChange();
      });

      it( 'should reset the form', function () {
        expect( instance.reset ).not.toHaveBeenCalled();
      });
    });

    describe( 'when there is no pending comment, and the form has not been submitted', function () {

      beforeEach( function () {
        spyOn( CommentStore, 'getPending' ).and.returnValue( null );
        instance.setState({ submitted: false });

        instance._onChange();
      });

      it( 'should reset the form', function () {
        expect( instance.reset ).not.toHaveBeenCalled();
      });
    });
  });

  describe( '#_shouldSetFixed', function () {

    beforeEach( function () {
      instance = React.renderComponent( CommentForm(props), container );
    });

    describe( 'when the bottom of the form falls off the edge of the viewport', function () {

      beforeEach( function () {
        spyOn( instance.refs.component.getDOMNode(), 'getBoundingClientRect' ).and.
          returnValue({ bottom: window.innerHeight + 1 });
      });

      it( 'should return true', function () {
        expect( instance._shouldSetFixed() ).toEqual( true );
      });
    });

    describe( 'when the bottom of the form is fully in the viewport', function () {

      beforeEach( function () {
        spyOn( instance.refs.component.getDOMNode(), 'getBoundingClientRect' ).and.
          returnValue({ bottom: window.innerHeight - 1 });
      });

      it( 'should return false', function () {
        expect( instance._shouldSetFixed() ).toEqual( false );
      });
    });
  });

});

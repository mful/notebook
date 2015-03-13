//= require react
//= require react_ujs
//= require underscore
//= require event_emitter.module
//= require flux/Flux.module
//= require shared/dispatchers/app_dispatcher

//= require shared/helpers/utility
//= require shared/helpers/xhr

//= require ledger/services/textarea_caret_position_service

window.scribble || ( window.scribble = {} );

describe( 'TextareaCaretPositionService', function () {

  beforeEach( function () {
    this.service = new TextareaCaretPositionService();
  });

  afterEach( function () {
    delete this.service;
  });

  // one, sweeping integration test
  describe( '#get', function () {

    var position = 10,
        placeholder = {offsetTop: 50, offsetLeft: 100},
        textarea = document.createElement( 'textarea' );

    beforeEach( function () {
      textarea.value = '012345678910';
      textarea.style.height = '100px';

      spyOn( textarea, 'getBoundingClientRect' ).and.returnValue({ top: 5, left: 10 });

      spyOn( window, 'getComputedStyle' ).and.returnValue({
        borderTopWidth: '1px',
        borderLeftWidth: '2px'
      });
    });

    it( 'should return the top coordinate', function () {
      expect( this.service.get(textarea, position).top ).toEqual( 6 );
    });
  });

  describe( '#createMirror', function () {

    var textarea = document.createElement( 'textarea' ),
        taProperties = [
          'direction',
          'boxSizing',
          'width',
          'height',
          'overflowX',
          'overflowY',

          'borderTopWidth',
          'borderRightWidth',
          'borderBottomWidth',
          'borderLeftWidth',

          'paddingTop',
          'paddingRight',
          'paddingBottom',
          'paddingLeft',

          'fontStyle',
          'fontVariant',
          'fontWeight',
          'fontStretch',
          'fontSize',
          'fontSizeAdjust',
          'lineHeight',
          'fontFamily',

          'textAlign',
          'textTransform',
          'textIndent',
          'textDecoration',

          'letterSpacing',
          'wordSpacing',
        ],
        otherProps = {
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          position: 'absolute',
          visibility: 'hidden'
        };

    beforeEach( function () {
      textarea.value = '012345678910';
      this.result = this.service.createMirror( textarea, 10 );
    });

    afterEach( function () {
      delete this.result;
    });

    it( 'should mirror the textarea css properties', function () {
      for ( var i = 0; i < taProperties.length; i++ ) {
        expect( this.result.style[taProperties[i]] ).toEqual( textarea.style[taProperties[i]] );
      }
    });

    it( 'should set the expected style properties', function () {
      var keys = Object.keys( otherProps );
      for( var i = 0; i < keys.length; i++ ) {
        expect( this.result.style[keys[i]] ).toEqual( otherProps[keys[i]] );
      }
    });

    it( 'should set the text of the given mirror to the text up to the cursor postion', function () {
      expect( this.result.textContent ).toEqual( '0123456789' );
    });
  });

  describe( '#injectSpan', function () {

    var parent = document.createElement( 'div' ),
        textarea = document.createElement( 'textarea' ),
        position = 10;

    beforeEach( function () {
      textarea.value = '012345678910';
      this.result = this.service.injectSpan( parent, textarea, position );
    });

    afterEach( function () {
      delete this.result;
    });

    it( 'should set the text content to the given textareas content at the given positon', function () {
      expect( this.result.innerText ).toEqual( '10' );
    });

    it( 'should append the a span to the given parent', function () {
      expect( parent.contains(this.result) ).toEqual( true );
    });
  });

  describe( '#getCoords', function () {

    var placeholder = {offsetTop: 50, offsetLeft: 100}
        textarea = {
          clientHeight: 100,
          getBoundingClientRect: function () {
            return {top: 5, left: 10}
          }
        };

    beforeEach( function () {
      spyOn( window, 'getComputedStyle' ).and.returnValue({
        borderTopWidth: '1px',
        borderLeftWidth: '2px'
      });
    });

    describe( 'when the textarea height is greater than the placeholder offset (no scroll)', function () {

      var expectedResult = {top: 50 + 1 + 5, left: 100 + 2 + 10 }

      it( 'should return the expected coordinates', function () {
        expect( this.service.getCoords(textarea, placeholder) ).toEqual( expectedResult );
      });
    });

    describe( 'when the text in the textarea covers more vertical height than the height of the textarea (scroll)', function () {

      var expectedResult = {top: 100 + 1 + 5, left: 100 + 2 + 10 }

      beforeEach( function () {
        placeholder.offsetTop = 101;
      });

      it( 'should return the expected coordinates', function () {
        expect( this.service.getCoords(textarea, placeholder) ).toEqual( expectedResult );
      });
    });
  });
});

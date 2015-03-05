scribble.helpers || (scribble.helpers = {});
scribble.helpers.utility = {};

( function ( namespace ) {

  namespace.debounce = function ( func, delay ) {
    var timer;

    return function () {
      var args = arguments;

      if ( timer ) clearTimeout( timer );

      timer = setTimeout(
        function () {
          func.apply( this, args );
        }
      ,
        delay
      );

      return timer;
    };
  };

})( scribble.helpers.utility );

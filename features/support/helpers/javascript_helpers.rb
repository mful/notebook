module JavaScriptHelper

  def highlight_text(elementSelector, startChar, endChar)
    page.execute_script %Q{
      var el = window.document.querySelector( "#{elementSelector}" ).firstChild,
          sel = window.getSelection(),
          range = window.document.createRange(),
          evt = document.createEvent("MouseEvents");

      range.setStart( el, #{startChar} );
      range.setEnd( el, #{endChar} );
      sel.removeAllRanges();
      sel.addRange( range );

      evt.initEvent("mouseup", true, true);

      setTimeout( function () {document.dispatchEvent(evt);}, 300 );
    }.split("\n").join('')
  end
end

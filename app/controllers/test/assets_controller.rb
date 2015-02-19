class Test::AssetsController < ApplicationController

  layout false

  def crayonjs
    render 'test/assets/javascripts/crayon'
  end

  def crayoncss
    render 'test/assets/styles/crayon.css', content_type: 'text/css'
  end
end

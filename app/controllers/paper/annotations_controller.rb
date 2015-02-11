class Paper::AnnotationsController < ApplicationController

  layout 'paper'

  def new
    @presenter = {
      type: 'annotation',
      text: params[:text],
      url: params[:url]
    }
  end
end

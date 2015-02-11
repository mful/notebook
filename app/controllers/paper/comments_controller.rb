class Paper::CommentsController < ApplicationController

  layout 'paper'

  def new
    @presenter = {
      type: 'comment',
      id: params[:id]
    }
  end
end

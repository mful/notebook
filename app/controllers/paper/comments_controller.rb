class Paper::CommentsController < ApplicationController

  layout 'paper'

  before_filter :find_annotation, only: [:new]

  def new
    @presenter = {
      type: 'comment',
      id: @annotation.id
    }
  end

  private

  def find_annotation
    @annotation = Annotation.find( params[:id] )
  end
end

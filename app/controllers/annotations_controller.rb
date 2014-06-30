class AnnotationsController < ApplicationController

  def show
    @annotation = Annotation.find(params[:id])
  end
end

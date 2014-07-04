class AnnotationsController < ApplicationController
  before_filter :find_annotation, only: [:show, :add_comment]

  def show
  end

  def add_comment
    comment = Comment.new(comment_params)

    if @annotation.comments << comment && @annotation.save
      redirect_to annotation_path(@annotation.id)
    else
      render new
    end
  end

  private

  def find_annotation
    begin @annotation = Annotation.find(params[:id])
    rescue
      raise Annotate::NotFoundError.new
    end
  end

  def comment_params
    params.require(:comment).permit(:content).merge(user: current_user)
  end
end

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

  def new
    annotation = Annotation.new(text: params[:text])
    page_url = params[:url] || request.url

    # TODO: move to view model?
    @presenter = {
      annotation: {
        text: annotation.text,
        base_domain: URI.parse(page_url).host,
        url: page_url
      },
      comments: []
    }
  end

  private

  def find_annotation
    begin @annotation = Annotation.find(params[:id])
    rescue
      raise Notebook::NotFoundError.new
    end
  end

  def comment_params
    params.require(:comment).permit(:content).merge(user: current_user)
  end
end

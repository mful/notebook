class AnnotationsController < ApplicationController
  layout :pick_layout

  before_filter :find_annotation, only: [:show, :add_comment]

  def show
    comments = @annotation.comments.map do |comment|
      CommentSerializer.new(comment).serializable_hash
    end

    @presenter = {
      annotation: @annotation,
      comments: comments
    }
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

  def pick_layout
    case action_name
    when 'show'
      'bubble'
    else
      'application'
    end
  end

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

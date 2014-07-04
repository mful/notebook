class Api::AnnotationsController < ApiController
  before_filter :find_annotation, only: [:show, :add_comment]

  def show
    render json: { annotation: @annotation }, status: 200
  end

  def create
    # TODO: uncomment this out once we have user-auth figured out
    # raise Annotate::Unauthorized.new unless signed_in?
    @annotation = Annotation.new(annotation_params)

    redirect_or_err(@annotation, :api_annotation_path, 400) do 
      CreateAnnotation.create @annotation, params[:url] || request.url
    end
  end

  def add_comment
    comment = Comment.new(comment_params)

    redirect_or_err(comment, :api_annotation_path, 400, @annotation.id) do
      binding.pry
      @annotation.comments << comment && @annotation.save
    end
  end

  private

  def find_annotation
    begin @annotation = Annotation.find(params[:id])
    rescue
      raise Annotate::NotFoundError.new
    end
  end

  def annotation_params
    params.require(:annotation).permit(:text)
  end

  def comment_params
    params.require(:comment).permit(:content).merge(user: current_user)
  end
end

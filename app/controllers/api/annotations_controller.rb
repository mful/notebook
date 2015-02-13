class Api::AnnotationsController < ApiController
  before_filter :find_annotation, only: [:show, :add_comment]
  before_filter :verify_user, only: [:create, :add_comment, :create_with_comment]

  def show
    render json: @annotation, status: 200, serializer: FullAnnotationSerializer, current_user: current_user
  end

  def create
    @annotation = Annotation.new(annotation_params)

    redirect_or_err(@annotation, :api_annotation_path, 400) do
      url = params[:url] || request.url
      CreateAnnotation.create @annotation, url, comment_params
    end
  end

  def add_comment
    comment = Comment.new(comment_params)

    redirect_or_err(comment, :api_comment_path, 400) do
      @annotation.comments << comment && @annotation.save
    end
  end

  def by_page
    page = Page.find_by_url Page.filter_url(params[:url])
    @annotations = page ? page.default_page_annotations : []

    if @annotations.length > 0
      GATrackWorker.perform_async 'Load Annotated Page', page.url, @annotations.length
    end

    # TODO: move to less robust serializer
    render json: @annotations, status: 200, each_serializer: FullAnnotationSerializer, current_user: current_user
  end

  private

  def verify_user
    raise Notebook::Unauthorized.new unless signed_in?
  end

  def find_annotation
    begin @annotation = Annotation.find(params[:id])
    rescue
      raise Notebook::NotFoundError.new
    end
  end

  def annotation_params
    params.require(:annotation).permit(:text)
  end

  def comment_params
    params.require(:comment).permit(:content).merge(user: current_user)
  end
end

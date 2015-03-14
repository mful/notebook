class Api::AnnotationsController < ApiController
  before_filter :find_annotation, only: [:show, :add_comment]
  before_filter :verify_user, only: [:create, :add_comment, :create_with_comment]

  def show
    render json: @annotation, status: 200, serializer: FullAnnotationSerializer, current_user: current_user
  end

  def create
    url = params[:url] || request.url
    @annotation = CreateAnnotation.create annotation_params, url, comment_params

    redirect_or_err(@annotation, :api_annotation_path, 400) do
      @annotation.persisted?
    end
  end

  def add_comment
    comment = Comment.new(comment_params)

    redirect_or_err(comment, :api_comment_path, 400) do
      @annotation.comments << comment && @annotation.save
    end
  end

  def by_page
    query = URI.parse(params[:url]).query
    params.merge! CGI.parse(query) if query

    page = Page.find_by_url Page.filter_url(params[:url])
    @annotations = FetchPageAnnotations.fetch( page, params )

    if @annotations.length > 0
      GATrackWorker.perform_async 'Load Annotated Page', page.url, @annotations.length
    end

    render json: @annotations, status: 200, each_serializer: AnnotationHighlightSerializer
  end

  private

  def verify_user
    raise Notebook::Unauthorized.new unless signed_in?
  end

  def find_annotation
    @annotation = Annotation.includes(:comments).find(params[:id])
  end

  def annotation_params
    params.require(:annotation).permit(:text)
  end

  def comment_params
    params.require(:comment).permit(:raw_content).merge(user: current_user)
  end
end

class Api::AnnotationsController < ApiController

  def show
    @annotation = Annotation.find(params[:id])
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

  private

  def annotation_params
    params.require(:annotation).permit(:text)
  end
end

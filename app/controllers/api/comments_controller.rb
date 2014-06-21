class Api::CommentsController < ApiController
  before_filter :find_comment, only: [:show, :update, :destroy]
  # TODO: should we be redirecting to login/register if !current_user?
  # TODO: Should server or client make that decision? 
  before_filter :authenticate!, only: [:update, :destroy]

  def show
    render json: { comment: @comment }, status: 200
  end

  def create
    raise Annotate::Unauthorized.new unless signed_in?
    @comment = Comment.new(comment_params)

    redirect_or_err(@comment, :api_comment_path, 400) { @comment.save }
  end

  def update
    redirect_or_err(@comment, :api_comment_path, 400) do
      @comment.update_attributes comment_params
    end
  end

  def destroy
    @comment.update_attributes deleted: true
    render json: { acknowledged: true }, status: 200
  end

  private

  def comment_params
    params.require(:comment).permit(:content).merge(user: current_user)
  end

  def find_comment
    @comment = Comment.find(params[:id])
  end

  def authenticate!
    raise Annotate::NotFoundError.new unless signed_in? && @comment.user_id == current_user.id
  end
end

class Api::CommentsController < ApiController
  before_filter :find_comment, only: [:show, :update, :destroy, :flag]

  def show
    render json: { comment: @comment }, status: 200
  end

  def create
    raise Notebook::Unauthorized.new unless signed_in?
    @comment = Comment.new(comment_params)
    @comment.annotation = Annotation.find(params[:annotation_id])

    redirect_or_err(@comment, :api_comment_path, 400) { @comment.save }
  end

  def update
    raise Notebook::Unauthorized.new unless can? :edit, @comment
    redirect_or_err(@comment, :api_comment_path, 400) do
      @comment.update_attributes comment_params
    end
  end

  def destroy
    raise Notebook::Unauthorized.new unless can? :delete, @comment
    @comment.destroy
    render json: { acknowledged: true }, status: 200
  end

  def flag
    if signed_in?
      @comment.comment_flags << CommentFlag.new(user: current_user)
      redirect_or_err(@comment, :api_comment_path, 400) { @comment.save }
    else
      raise Notebook::Unauthorized.new
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content).merge(user: current_user)
  end

  def find_comment
    @comment = Comment.find(params[:id])
  end
end

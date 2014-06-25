class Api::CommentsController < ApiController
  before_filter :find_comment, only: [:show, :update, :destroy] 

  def show
    render json: { comment: @comment }, status: 200
  end

  def create
    raise Annotate::Unauthorized.new unless signed_in?
    @comment = Comment.new(comment_params)

    redirect_or_err(@comment, :api_comment_path, 400) { @comment.save }
  end

  def update
    raise Annotate::Unauthorized.new unless can? :edit, @comment
    redirect_or_err(@comment, :api_comment_path, 400) do
      @comment.update_attributes comment_params
    end
  end

  def destroy
    raise Annotate::Unauthorized.new unless can? :delete, @comment
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
end

class Api::CommentsController < ApiController
  before_filter :find_comment, only: [:show, :update, :destroy, :flag, :add_reply, :add_vote, :replies]
  before_filter :ensure_signed_in, only: [:flag, :add_vote, :add_reply, :create]

  def show
    render json: @comment, status: 200, serializer: CommentSerializer, current_user: current_user
  end

  def replies
    render json: @comment.replies, status: 200, each_serializer: CommentSerializer, current_user: current_user
  end

  def create
    @comment = Comment.new(comment_params)
    @comment.annotation = Annotation.find(params[:annotation_id])

    redirect_or_err(@comment, :api_comment_path, 400) do
      @comment.save &&
      GATrackWorker.perform_async('Create Comment', @comment.annotation.page.url, false)
    end
  end

  def update
    raise Notebook::Unauthorized.new unless can? :edit, @comment
    redirect_or_err(@comment, :api_comment_path, 400) do
      @comment.update_attributes comment_params
    end
  end

  def add_reply
    @reply = Comment.new(reply_params)

    redirect_or_err @reply, :api_comment_path, 400 do
      @reply.save && @comment.replies << @reply &&
      GATrackWorker.perform_async('Create Reply', @reply.parent_comment.id)
    end
  end

  # TODO: move to vote service
  def add_vote
    @vote = @comment.votes.find_by_user_id(current_user.id)

    if @vote
      @vote.positive = vote_params[:positive]
    else
      @vote = Vote.new(vote_params)
    end

    redirect_or_err(@vote, :api_comment_path, 400, @comment.id) do
      trackVal = @vote.positive ? 'Up' : 'Down'
      updated = !@vote.persisted? || @vote.changed?
      @vote.save &&
      (updated ? GATrackWorker.perform_async('Vote', trackVal, @comment.id) : true)
    end
  end

  def destroy
    raise Notebook::Unauthorized.new unless can? :delete, @comment
    @comment.destroy
    render json: { acknowledged: true }, status: 200
  end

  def flag
    @comment.comment_flags << CommentFlag.new(user: current_user)
    redirect_or_err(@comment, :api_comment_path, 400) { @comment.save }
  end

  private

  def ensure_signed_in
    raise Notebook::Unauthorized.new unless signed_in?
  end

  def comment_params
    params.require(:comment).permit(:content).merge(user: current_user)
  end

  def reply_params
    params.require(:reply).permit(:content).merge(user: current_user)
  end

  def vote_params
    params.require(:vote).permit(:positive).merge(user: current_user, comment: @comment)
  end

  def find_comment
    @comment = Comment.find(params[:id])
  end
end

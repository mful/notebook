class Retort::CommentsController < ApplicationController

  layout 'retort'

  before_filter :find_comment, only: [:replies]

  def replies
    replies = @comment.replies.map do |reply|
      CommentSerializer.new(reply).serializable_hash
    end

    @presenter = {
      parent_id: @comment.id,
      replies: replies,
      server_rendered: true
    }
  end

  private

  def find_comment
   @comment = Comment.find(params[:id])
  end

end

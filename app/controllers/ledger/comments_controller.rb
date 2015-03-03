class Ledger::CommentsController < ApplicationController

  layout 'ledger'

  before_filter :find_comment, only: [:show]

  def show
    comment = FullCommentSerializer.new( @comment, current_user: current_user ).serializable_hash

    @presenter = {
      comment: comment,
      replies: comment[:replies],
      server_rendered: true,
      reply_id: params[:reply_id]
    }
  end

  private

  def find_comment
    @comment = Comment.includes(:replies).find(params[:id])
  end
end

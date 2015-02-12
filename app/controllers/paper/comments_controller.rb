class Paper::CommentsController < ApplicationController

  layout 'paper'

  before_filter :find_annotation, only: [:new]
  before_filter :find_comment, only: [:add_reply]

  def new
    @presenter = {
      type: 'comment',
      id: @annotation.id
    }
  end

  def add_reply
    @presenter = {
      type: 'reply',
      id: @comment.id
    }
  end

  private

  def find_annotation
    @annotation = Annotation.find(params[:id])
  end

  def find_comment
    @comment = Comment.find(params[:id])
  end
end

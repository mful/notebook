class CommentFlag < ActiveRecord::Base
  belongs_to :comment
  belongs_to :user

  validates_uniqueness_of :comment_id, scope: :user_id
end

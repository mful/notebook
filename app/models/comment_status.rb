class CommentStatus < ActiveRecord::Base
  has_many :comments 
end

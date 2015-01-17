class Vote < ActiveRecord::Base
  belongs_to :user
  belongs_to :comment, touch: true

  validates_presence_of :user, :comment
  validates_uniqueness_of :comment_id, scope: :user_id

  scope :positive, -> { where positive: true }
end

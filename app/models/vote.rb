class Vote < ActiveRecord::Base
  belongs_to :user
  belongs_to :comment, touch: true

  validates_presence_of :user, :comment
  validate :no_selfies

  scope :positive, -> { where positive: true }

  private

  def no_selfies
    if user == comment.user
      errors.add nil, 'You can\'t vote on your own comment. Come on.'
    end
  end
end

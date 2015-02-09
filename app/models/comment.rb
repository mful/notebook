class Comment < ActiveRecord::Base
  include Rateable

  DEFAULT_RATING = 0.05

  belongs_to :user
  belongs_to :annotation
  belongs_to :comment_status
  # has_many :pages
  has_many :votes
  has_many :comment_replies
  has_many :replies, through: :comment_replies
  has_many :comment_flags

  after_create :add_selfie_vote
  after_save :set_rating, on: :update
  after_touch :set_rating # TODO: move to vote service

  validates_presence_of :content, :user
  validates :content, length: { minimum: 15 }

  scope :by_rating, -> { order('rating DESC') }

  def destroy
    update_attribute :comment_status, CommentStatus.find_by_name('deleted')
  end

  def deleted?
    comment_status && comment_status.name == 'deleted'
  end

  def set_rating
    update_column :rating, calculate_rating(
      votes.where(positive: true).count,
      votes.count,
      default_rating: DEFAULT_RATING
    )
  end

  def simple_score
    votes.where(positive: true).size - votes.where(positive: false).size
  end

  private

  def add_selfie_vote
    self.votes << Vote.new(user: user, positive: true)
  end
end

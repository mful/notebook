class Comment < ActiveRecord::Base
  include Rateable

  DEFAULT_RATING = 0.05

  belongs_to :user
  belongs_to :annotation
  belongs_to :comment_status
  has_many :pages
  has_many :votes
  has_many :comment_replies
  has_many :replies, through: :comment_replies
  has_many :comment_flags

  before_validation :sanitize_content
  before_create :set_rating
  after_touch :set_rating # TODO: move to vote service

  validates_presence_of :content, :user

  def destroy
    update_attribute :comment_status, CommentStatus.find_by_name('deleted')
  end

  def deleted?
    comment_status && comment_status.name == 'deleted'
  end

  def set_rating
    self.rating =
      calculate_rating(votes.positive.count, votes.count, default_rating: DEFAULT_RATING)
    save unless new_record?
  end

  private

  def sanitize_content
    self.content = Nokogiri::HTML(content).text.strip
  end
end

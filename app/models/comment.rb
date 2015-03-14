class Comment < ActiveRecord::Base
  include Rateable

  DEFAULT_RATING = 0.05

  belongs_to :user, touch: true
  belongs_to :annotation
  belongs_to :comment_status
  # has_many :pages
  has_many :votes
  has_many :comment_replies
  has_many :replies, through: :comment_replies
  has_many :comment_flags
  has_many :events, as: :notifiable
  has_many :subscriptions, as: :notifiable

  before_create :add_selfie_vote
  before_save :update_html_content
  after_save :setup_notifications
  after_save :set_rating, on: :update

  after_touch :set_rating # TODO: move to vote service

  validates_presence_of :raw_content, :user
  validates :raw_content, length: { minimum: 15 }

  scope :by_rating, -> { order('rating DESC') }

  def destroy
    update_attribute :comment_status, CommentStatus.find_by_name('deleted')
  end

  def deleted?
    comment_status && comment_status.name == 'deleted'
  end

  def parent_comment
    Comment.joins(:comment_replies).
      where("comment_replies.comment_id = comments.id AND comment_replies.reply_id = ?", id).
      first
  end

  def update_html_content
    return unless new_record? || raw_content_changed?

    renderer = CommentRenderer.new(
      filter_html: true,
      no_images: true,
      no_styles: true,
      escape_html: true,
      hard_wrap: true,
      link_attributes: { rel: 'nofollow' }
    )
    parser = Redcarpet::Markdown.new(renderer, autolink: true, quote: true)

    self.content = parser.render raw_content
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

  def setup_notifications
    if (new_record? && (annotation_id || parent_comment)) ||
      annotation_id_changed?
      Notifications::CommentPubSub.new.after_save self
    elsif (annotation_id || parent_comment) && raw_content_changed?
      Notifications::CommentPubSub.new.post_at_mentions self
    end
  end
end

class Comment < ActiveRecord::Base
  include Rateable
  DEFAULT_RATING = 0.05

  belongs_to :user
  has_many :pages
  has_many :votes

  before_validation :sanitize_content
  before_create :set_rating
  after_touch :set_rating

  validates_presence_of :content, :user

  def destroy
    update_attributes deleted: true
  end

  def set_rating
    self.rating =
      calculate_rating(votes.positive.count, votes.count, default_rating: DEFAULT_RATING)
    save unless new_record?
  end

  private

  def sanitize_content
    self.content = Nokogiri::HTML(content).text
  end
end

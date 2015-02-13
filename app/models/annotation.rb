class Annotation < ActiveRecord::Base
  belongs_to :page
  has_many :comments, -> { order 'rating DESC' }

  before_validation :sanitize_text

  validates_presence_of :text, :page
  validates :text, length: { minimum: 5, maximum: 400 }

  def simple_score
    comments.sum :rating;
  end

  private

  def sanitize_text
    self.text = Nokogiri::HTML(text).text
  end
end

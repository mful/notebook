class Annotation < ActiveRecord::Base
  belongs_to :page
  has_many :comments, -> { order 'rating DESC' }

  before_validation :sanitize_text

  validates_presence_of :text, :page
  # TODO: think about the min/max here a bit more
  validates :text, length: { minimum: 5, maximum: 1000 }

  private

  def sanitize_text
    self.text = Nokogiri::HTML(text).text
  end
end

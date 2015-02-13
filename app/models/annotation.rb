class Annotation < ActiveRecord::Base
  belongs_to :page
  has_many :comments, -> { order 'rating DESC' }

  validates_presence_of :text, :page
  validates :text, length: { minimum: 5, maximum: 400 }

  def simple_score
    comments.sum :rating;
  end
end

class Annotation < ActiveRecord::Base
  belongs_to :page
  has_many :comments, -> { order 'rating DESC' }

  validates_presence_of :text, :page
  validates :text, length: { minimum: 5, maximum: 400 }

  after_touch :set_score
  after_create :set_score

  def determine_likeness(src, dest)
    score = 0
    src_sections = partition(src)
    dest_sections = partition(dest)

    for i in 0..src_sections.size
      score += 10 if src_sections[i] == dest_sections[i]
    end

    return score
  end

  # partitions a set of text into sections of ten
  def partition
    # should validate length to be reasonable on the client
    length = text.size
    offset = 0
    sections = []

    # split into tenths
    (0..length).step(length / 10) do |i|
      sections << Digest::MD5.hexdigest(text[offset..i])
      offset = i + 1
    end
  end

  def set_score
    update_column :simple_score, comments.sum(:rating)
  end
end

class Comment < ActiveRecord::Base
  belongs_to :user
  has_many :pages

  before_validation :sanitize_content

  validates_presence_of :content, :user

  def destroy
    update_attributes deleted: true
  end

  private

  def sanitize_content
    self.content = Nokogiri::HTML(content).text
  end
end

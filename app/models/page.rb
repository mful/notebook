class Page < ActiveRecord::Base
  belongs_to :entity
  # belongs_to :comment
  has_many :annotations

  before_validation :sanitize_url

  validates_presence_of :url, :entity
  validates_format_of :url, with: /([A-Za-z0-9\-~_]*)\.[a-z][a-z]/
  validates_uniqueness_of :url

  def self.find_or_create_by_url(url)
    page = where(url: filter_url(url)).first
    page ? page : CreatePage.create(Page.new(url: url))
  end

  private

  def sanitize_url
    self.url = self.class.filter_url(url)
  end

  def self.filter_url(url)
    uri = URI.parse(url)
    url_string = "%s%s" % [uri.host, uri.path]
    url_string.concat("?#{uri.query}") if uri.query

    url_string
  end
end

class Page < ActiveRecord::Base
  belongs_to :entity

  before_validation :sanitize_url

  validates_presence_of :url
  validates_format_of :url, with: /([A-Za-z0-9\-~_]*)\.[a-z][a-z]/

  private

  def sanitize_url
    uri = URI.parse(url)
    url_string = "%s%s" % [uri.host, uri.path]
    url_string.concat("?#{uri.query}") if uri.query

    self.url = url_string
  end
end

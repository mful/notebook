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

  def self.filter_url(url)
    uri = URI.parse(url)
    url_string = "%s%s" % [uri.host, uri.path]

    url_string
  end

  def default_page_annotations(count = 10, max_recents = 5, recent_time_ago = 3.days.ago)
    return annotations if annotations.count < count

    tops = top_annotations(count)
    recents = annotations.where('created_at > ?', recent_time_ago).
                          where('id NOT IN (?)', tops.map(&:id)).
                          order('created_at DESC').
                          limit(max_recents)

    tops[0...(count - recents.length)].concat recents
  end

  def top_annotations(count = 10)
    annotations.order('simple_score DESC').limit(10)
  end

  private

  def sanitize_url
    self.url = self.class.filter_url(url)
  end
end

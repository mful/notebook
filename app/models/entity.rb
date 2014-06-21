class Entity < ActiveRecord::Base
  has_many :pages

  before_validation :sanitize_url

  validates_presence_of :base_domain
  validates_format_of :base_domain, with: /\A[a-z0-9-]*\.[a-z]{2,3}\z/

  def self.find_or_create_by_url(url)
    uri = URI.parse(url)
    entity = where(base_domain: filter_host(uri.host)).first

    entity ? entity : create(base_domain: url)
  end

  private

  def sanitize_url
    host = URI.parse(base_domain.downcase).host
    self.base_domain = self.class.filter_host(host)
  end

  def self.filter_host(host)
    if host
      pieces = host.split('.')
      pieces.length > 2 ? [pieces[-2], pieces[-1]].join('.') : host
    end
  end
end

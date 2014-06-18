class Entity < ActiveRecord::Base
  has_many :pages

  before_validation :sanitize_url

  validates_presence_of :base_domain
  validates_format_of :base_domain, with: /\A[a-z0-9-]*\.[a-z]{2,3}\z/

  private

  def sanitize_url
    host = URI.parse(base_domain.downcase).host

    if host && host.split('.').length > 2
      self.base_domain = host.sub(/([^.]*)\./, '') 
    end
  end
end

class User < ActiveRecord::Base
  has_secure_password

  validate { |user| UsersValidator.validate user }

  before_create :create_remember_token
  before_save { self.email = email.downcase }

  has_many :connections
  has_many :votes
  has_and_belongs_to_many :roles
  has_many :subscriptions
  has_many :notifications
  has_many :comments

  after_touch :set_score

  def self.by_username( text, count = 5 )
    where("username ILIKE ?", text + '%').limit(count)
  end

  def current_notifications
    notifications.order('created_at DESC').limit(20)
  end

  # TODO: move this remember token logic
  def new_remember_token
    SecureRandom.urlsafe_base64
  end

  def digest(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  def has_role?(role)
    roles.map(&:name).include?(role)
  end

  def remember
    update_attribute(:remember_token, digest(new_remember_token))
  end

  def forget
    update_attribute(:remember_token, nil)
  end

  def authenticated?(token)
    return false unless remember_token
    digest(remember_token) == token
  end

  private

  def create_remember_token
    self.remember_token = digest(new_remember_token)
  end

  def set_score
    pos = Vote.where(positive: true).joins(:comment).where('comments.user_id = ?', id).size
    neg = Vote.where(positive: false).joins(:comment).where('comments.user_id = ?', id).size
    update_column :simple_score, pos - neg
  end
end

class User < ActiveRecord::Base
  has_secure_password

  validate { |user| UsersValidator.validate user }

  before_create :create_remember_token
  before_save { self.email = email.downcase }

  has_many :connections
  has_many :votes
  has_and_belongs_to_many :roles

  def self.by_username( text, count = 5 )
    where("username ILIKE ?", text + '%').limit(count)
  end

  def current_notifications
    [
      {
        id: 1,
        message: '<strong>@mattmattmatt</strong> replied to your annotation on <strong>13-year Old Drinking Prodigy...</strong> on theonion.com',
        url: 'http://theonion.com',
        notification_type: 'reply',
        reply_id: 3,
        annotation_id: 1,
        comment_id: 2
      },
      {
        id: 2,
        message: '<strong>@mattmattmatt</strong> replied to your annotation on <strong>13-year Old Drinking Prodigy Accepted into OSU</strong> on theonion.com',
        url: 'http://theonion.com',
        notification_type: 'reply',
        reply_id: 3,
        annotation_id: 1,
        comment_id: 2
      },
      {
        id: 3,
        message: '<strong>@mattmattmatt</strong> replied to your annotation on <strong>13-year Old Drinking Prodigy Accepted into OSU</strong> on theonion.com',
        url: 'http://theonion.com',
        notification_type: 'reply',
        reply_id: 3,
        annotation_id: 1,
        comment_id: 2
      },
      {
        id: 4,
        message: '<strong>@mattmattmatt</strong> replied to your annotation on <strong>13-year Old Drinking Prodigy Accepted into OSU</strong> on theonion.com',
        url: 'http://theonion.com',
        notification_type: 'reply',
        reply_id: 3,
        annotation_id: 1,
        comment_id: 2
      },
    ]
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
end

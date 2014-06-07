class User < ActiveRecord::Base
  has_secure_password

  validate { |user| UsersValidator.validate user }

  before_create :create_remember_token
  before_save { self.email = email.downcase }

  has_many :connections

  # TODO: move this remember token logic
  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.digest(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private

  def create_remember_token
    self.remember_token = User.digest(User.new_remember_token)
  end
end

class CreateUser

  def self.create(user, options = {})
    new(user, options).create
  end

  def initialize(user, options = {})
    @user = user
  end

  def create
    if @user.save
      send_welcome_email
      track_create
    end

    @user
  end

  private

  def send_welcome_email
    WelcomeMailer.welcome(@user).deliver
  end

  def track_create
    GATrackWorker.perform_async 'Create User'
  end
end

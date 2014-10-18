class UsersValidator
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  PASSWORD_MIN_LENGTH = 6
  PASSWORD_MAX_LENGTH = 50
  USERNAME_MAX_LENGTH = 20
  VALID_USERNAME_REGEX = /\A[a-zA-Z0-9_]*\z/

  def self.validate(user)
    self.new(user).validate
  end

  def initialize(user)
    @user = user
  end

  def validate
    validate_email if @user.new_record? || @user.email_changed?
    validate_password if @user.new_record? || @user.password.present?
    validate_username if @user.username

    @user
  end

  private

  def validate_email
    if @user.email.blank?
      @user.errors.add :email, 'can\'t be blank'
    elsif !@user.email.match VALID_EMAIL_REGEX
      @user.errors.add :email, 'looks like it might have a typo'
    elsif User.where(email: @user.email).first
      @user.errors.add :email, 'address is already registered.'
    end
  end

  def validate_password
    if @user.password.blank?
      @user.errors.add :password, 'can\'t be blank'
    elsif @user.password.length < PASSWORD_MIN_LENGTH ||
        @user.password.length > PASSWORD_MAX_LENGTH
      @user.errors.add(
          :password,
          "must be between #{PASSWORD_MIN_LENGTH} and #{PASSWORD_MAX_LENGTH} characters"
      )
    elsif @user.password != @user.password_confirmation
      @user.errors.add :password, 'and confirmation have to match.'
    end
  end

  def validate_username
    if @user.username.blank?
      @user.username = nil
      return
    end
    
    valid_regex = @user.username.match /#{VALID_USERNAME_REGEX}/
    if valid_regex
      name_user = User.where('lower(username) = ?', @user.username.downcase)
    end

    if !valid_regex
      @user.errors.add :username, 'can only contain alphanumeric characters and underscores'
    elsif @user.username.length > USERNAME_MAX_LENGTH
      @user.errors.add :username, "can't be more than 20 characters"
    elsif name_user.first && name_user.first.id != @user.try(:id)
      @user.errors.add :username, 'is already taken.'
    end
  end

end

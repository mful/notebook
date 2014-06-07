class UsersValidator
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_PASSWORD_REGEXES = [/[0-9]/, /[A-Z]/, /[!@\#$%^&*+=]/]
  PASSWORD_MIN_LENGTH = 8
  PASSWORD_MAX_LENGTH = 50
  OMNIAUTH_SOURCES = %w(google_oauth2)

  def self.validate(user)
    self.new(user).validate
  end

  def initialize(user)
    @user = user
  end

  # TODO: remove need to for email?
  def validate
    validate_email if @user.new_record? || @user.email_changed?
    validate_password if @user.new_record? || @user.password.present?

    @user
  end

  private

  def validate_email
    if @user.email.blank?
      @user.errors.add :email, 'can\'t be blank'
    elsif !@user.email.match VALID_EMAIL_REGEX
      @user.errors.add :email, 'looks like it might have a typo'
    elsif User.where(email: @user.email).first
      @user.errors.add :email, 'is already registered.'
    end
  end

  def validate_password
    special_chars_base =
        'have a capital letter, number, and one of these: !@\#$%^&*+='

    if @user.password.blank?
      @user.errors.add :password, 'can\'t be blank'
    elsif @user.password.length < PASSWORD_MIN_LENGTH ||
        @user.password.length > PASSWORD_MAX_LENGTH
      @user.errors.add(
          :password,
          'must be between 8 and 50 characters, and ' + special_chars_base
      )
    # TODO: rethink this -- this is silly
    elsif !password_match_regex?
      @user.errors.add(
          :password,
          'must ' + special_chars_base
      )
    elsif @user.password != @user.password_confirmation
      @user.errors.add :password, 'and confirmation have to match.'
    end
  end

  def password_match_regex?
    VALID_PASSWORD_REGEXES.each do |regex|
      return false unless @user.password.match(regex)
    end
    true
  end

  def changed?(field)
    @user.new_record? || @user.send("#{field}_changed?".to_sym)
  end
end

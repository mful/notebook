class ResetPasswordMailer < MandrillMailer::TemplateMailer
  default from: 'hello@intelligent.ly'

  def password_reset(email, password)
    mandrill_mail(
      template: 'Password Reset',
      subject: 'Intelligent.ly: Reset Password',
      to: { email: email },
      vars: { 'PASSWORD' => password },
      inline_css: true,
    )
  end

  test_setup_for :password_reset do |mailer, options|
    email = MandrillMailer::Mock.new({
      email: options[:email]
    })
    password = SecureRandom.urlsafe_base64(10)
    mailer.welcome(email, password).deliver
  end
end

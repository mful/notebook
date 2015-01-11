class WelcomeMailer < MandrillMailer::TemplateMailer
  default from: 'm@scribble.ly'

  def welcome(user)
    mandrill_mail(
      template: 'Welcome',
      subject: 'Hey Welcome to Scribble!',
      to: { email: user.email },
      inline_css: true,
    )
  end

  test_setup_for :welcome do |mailer, options|
    user = MandrillMailer::Mock.new({
      email: options[:email],
    })
    mailer.welcome(user).deliver
  end
end

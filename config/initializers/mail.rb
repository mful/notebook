mandrill_config = YAML.load_file(Rails.root + 'config/mandrill.yml')[Rails.env]

ActionMailer::Base.smtp_settings = {
  :address   => "smtp.mandrillapp.com",
  :port      => 587,
  :user_name => mandrill_config[:username],
  :password  => mandrill_config[:password],
  :domain    => 'heroku.com'
}
ActionMailer::Base.delivery_method = :smtp

MandrillMailer.configure do |config|
  config.api_key = mandrill_config[:api_key]
end

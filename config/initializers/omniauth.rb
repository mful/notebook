if Rails.env == 'production'
  omniauth_config = {
    google_id: ENV['GOOGLE_ID'],
    google_secret: ENV['GOOGLE_SECRET'],
    github_id: ENV['GITHUB_ID'],
    github_secret: ENV['GITHUB_SECRET']
  }
else
  omniauth_config = YAML.load_file(Rails.root + 'config/omniauth.secret.yml')[Rails.env]
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, omniauth_config[:google_id], omniauth_config[:google_secret]
  provider :github, omniauth_config[:github_id], omniauth_config[:github_secret], scope: 'user:email'
end

Rails.application.config.omniauth_config = omniauth_config

OmniAuth.config.on_failure = Api::SessionsController.action(:auth_failure)

if Rails.env == 'production'
  fb_config = {
    app_id: ENV['FB_APP_ID'],
    app_secret: ENV['FB_APP_SECRET']
  }
else
  fb_config = YAML.load_file(Rails.root + 'config/facebook.secret.yml')[Rails.env]
end

Rails.application.config.fb = fb_config

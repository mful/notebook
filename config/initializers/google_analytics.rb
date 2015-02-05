if Rails.env == 'production'
  ga_config = {
    tracking_code: ENV['GA_TRACKING_CODE'],
    host: ENV['GA_HOST']
  }
else
  ga_config = YAML.load_file(Rails.root + 'config/google_analytics.secret.yml')[Rails.env]
end

Notebook::Application.config.google_analytics = ga_config

if Rails.env == 'production'
  fb_config = YAML.load_file(Rails.root + 'config/facebook.yml')[Rails.env]
else
  fb_config = YAML.load_file(Rails.root + 'config/facebook.secret.yml')[Rails.env]
end

Rails.application.config.fb = fb_config

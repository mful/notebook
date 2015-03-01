source 'https://rubygems.org'

ruby '2.2.0'
gem 'rails', '4.1.6'

gem 'unicorn'

gem 'pg'
gem 'redis'

gem 'sidekiq'

gem 'gabba'

gem 'nokogiri'

gem 'turbolinks'

gem 'gon'
gem 'active_model_serializers', git: 'https://github.com/rails-api/active_model_serializers.git', branch: '0-9-stable'

gem 'sass-rails', '~> 4.0.2'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'

gem 'bcrypt', '~> 3.1.7'
gem 'omniauth-google-oauth2'
gem 'omniauth-github'
gem 'omniauth-facebook'
gem 'omniauth-twitter'

gem 'gibbon'
gem 'mandrill_mailer'

gem 'peek'
gem 'peek-performance_bar'
gem 'peek-pg'

gem 'actionpack-page_caching'

gem 'cancancan', '~> 1.8'

gem 'sprockets-commonjs', github: 'maccman/sprockets-commonjs'
gem 'react-rails', '~> 1.0.0.pre', github: 'reactjs/react-rails'
gem 'therubyracer', :platforms => :ruby

gem 'redcarpet'

group :production do
  gem 'rails_12factor'
end

group :development, :test do
  gem 'pry'
  gem 'pry-stack_explorer'
  gem 'factory_girl_rails', require: false
  gem 'rspec-rails'
end

group :test do
  gem 'database_cleaner'
  gem 'capybara'
  gem 'capybara-webkit'
  gem 'selenium-webdriver'
  gem 'chromedriver-helper'
end

group :test, :development do
  gem 'jasmine-rails'
end

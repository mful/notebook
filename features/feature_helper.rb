# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'factory_girl_rails'
require 'mandrill_mailer/offline'
require 'capybara/rspec'
require 'sidekiq/testing'

Sidekiq::Testing.inline!

Capybara.app_host = 'http://scribble.test:31234'
Capybara.server_port = 31234

Capybara.register_driver :chrome do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.javascript_driver = :chrome

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }
Dir[Rails.root.join("features/support/**/*.rb")].each { |f| require f }

# Checks for pending migrations before tests are run.
# If you are not using ActiveRecord, you can remove this line.
ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

OmniAuth.config.test_mode = true
OmniAuth.config.add_mock(
  :google_oauth2,
  {
    :provider => "google_oauth2",
    :uid => "123456789",
    :info => {
      :name => "John Doe",
      :email => FactoryGirl.attributes_for(:google_user)[:email],
      :first_name => "John",
      :last_name => "Doe",
      :image => "https://lh3.googleusercontent.com/url/photo.jpg"
    },
    :credentials => {
      :token => "token",
      :refresh_token => "another_token",
      :expires_at => 1354920555,
      :expires => true
    },
    :extra => {
      :raw_info => {
        :sub => "123456789",
        :email => "user@domain.example.com",
        :email_verified => true,
        :name => "John Doe",
        :given_name => "John",
        :family_name => "Doe",
        :profile => "https://plus.google.com/123456789",
        :picture => "https://lh3.googleusercontent.com/url/photo.jpg",
        :gender => "male",
        :birthday => "0000-06-25",
        :locale => "en",
        :hd => "company_name.com"
      }
    }
  }
)

OmniAuth.config.add_mock(
  :facebook,
  {
    :provider=>"facebook",
    :uid=>"10201771234567891",
    :info=> {
      :email=>"user@domain.example.com",
      :name=>"John Doe",
      :first_name=>"John",
      :last_name=>"Doe",
      :image=>"http://graph.facebook.com/10201771234567891/picture",
      :urls=> {
        :Facebook=> "https://www.facebook.com/app_scoped_user_id/10201771234567891/"},
      :verified=>true
    },
    :credentials=> {
      :token=> "CAAEQFFgbWqkBAEtIdZBoB4jbNGJbcRL5nl7azSZCIRb51Wp6DBT9iD0moQLkyywctxZCFRVDR1SSH9poWNtBDvaZCgQi9ZCqgrokTt0IJa",
      :expires_at=>1421341199,
      :expires=>true
    },
    :extra=> {
      :raw_info=> {
        :id=>"10201771234567891",
        :email=>"user@domain.example.com",
        :name=>"John Doe",
        :first_name=>"John",
        :last_name=>"Doe",
        :link=>"https://www.facebook.com/app_scoped_user_id/10201771234567891/",
        :locale=>"en_US",
        :name=>"John Doe",
        :timezone=>-5,
        :updated_time=>"2014-06-17T02:20:15+0000",
        :verified=>true
      }
    }
  }
)

# Setup test only routes for fully integrated acceptance testing
test_routes = Proc.new do
  get 'tests/sama' => 'test/tests#sama', as: 'test_sama'
  get 'tests/assets/crayon.js' => 'test/assets#crayonjs', as: 'test_assets_crayonjs'
  get 'tests/assets/crayon.css' => 'test/assets#crayoncss', as: 'test_assets_crayoncss'
end
Rails.application.routes.eval_block(test_routes)

RSpec.configure do |config|
  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/features/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = false

  DatabaseCleaner.strategy = :truncation

  config.before(:suite) do
    DatabaseCleaner.strategy = :truncation
  end

  config.before(:each) do
    DatabaseCleaner.clean
    Rails.application.load_seed
  end

  config.after(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end

  # copy over crayon assets from build
  config.before :suite do
    %x(
      mkdir app/views/test/assets
      mkdir app/views/test/assets/javascripts
      mkdir app/views/test/assets/styles
      cp #{Rails.application.config.crayon[:script_path]} #{Rails.root + 'app/views/test/assets/javascripts/crayon.js'}
      cp #{Rails.application.config.crayon[:styles_path]} #{Rails.root + 'app/views/test/assets/styles/crayon.css'}
    )
  end

  config.after :suite do
    %x(
      rm -rf #{Rails.root + 'app/views/test/assets'}
    )
  end

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  # config.order = "random"
end

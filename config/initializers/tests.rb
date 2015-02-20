if Rails.env == 'test'
  test_config = YAML.load(
    ERB.new(File.read(Rails.root + 'config/tests.yml.erb')).result
  )[Rails.env]
  Rails.application.config.crayon = test_config[:crayon]
end

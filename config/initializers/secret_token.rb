# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
Notebook::Application.config.secret_key_base = if Rails.env.development? or Rails.env.test?
  '1d368098263278571c0af005083958f3af9a89c60d9e3c2a778d9b6ab5bc2ec4d57d1432adfc33a4e2eea41ba778d0e69bd6458883545227d2011d2e6d6fa8f3'
else
  ENV['SECRET_TOKEN']
end

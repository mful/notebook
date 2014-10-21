# Be sure to restart your server when you modify this file.

domain = Rails.env == 'production' ? 'scribble.ly' : 'scribble.dev'

Notebook::Application.config.session_store :cookie_store, key: '_scribble_session', domain: domain

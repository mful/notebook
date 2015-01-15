require 'uri'
require 'net/http'

module FbIntegrationHelper

  def app_client
    # @fb_app_client ||= Mogli::AppClient.new(access_token, Rails.application.config.fb[:app_id])
  end

  def create_fb_test_user(options)
    query = {
      :installed => true,
      access_token: access_token
    }.merge(options)

    uri = URI("https://graph.facebook.com/#{Rails.application.config.fb[:app_id]}/accounts/test-users")
    res = Net::HTTP.post_form(uri, query)

    JSON.parse res.body
  end

  def destroy_fb_test_user(user)
    uri = URI("https://graph.facebook.com/#{Rails.application.config.fb[:app_id]}/accounts/test-users")
    uri.query = URI.encode_www_form(uid: user['id'])
    http = Net::HTTP.new(uri)
  end

  def access_token
    return @fb_access_token if @fb_access_token

    uri = URI('https://graph.facebook.com/oauth/access_token')
    query = {
      client_id: Rails.application.config.fb[:app_id],
      client_secret: Rails.application.config.fb[:app_secret],
      grant_type: 'client_credentials'
    }

    uri.query = URI.encode_www_form(query)

    res = Net::HTTP.get(uri)

    @fb_access_token = res.split('=')[-1]
  end
end

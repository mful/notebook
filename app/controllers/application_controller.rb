class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :bootstrap

  include SessionsHelper

  rescue_from ActiveRecord::RecordNotFound, with: :rescue_not_found

  class Notebook::NotFoundError < StandardError; end
  rescue_from Notebook::NotFoundError, with: :rescue_not_found

  class Notebook::Unauthorized < StandardError; end
  rescue_from Notebook::Unauthorized, with: :rescue_unauthorized

  protected

  # TODO: add custom 404 page here
  def rescue_not_found
    render "#{Rails.root}/public/404.html", status: 404
  end

  # TODO: redirect to login page if no current user
  def rescue_unauthorized
    render nothing: true, status: 403
  end

  private

  def bootstrap
    gon.env = Rails.env
    gon.current_user = UserSerializer.new(current_user) if current_user
    gon.logo = ActionController::Base.helpers.asset_path('logo.png')
  end
end

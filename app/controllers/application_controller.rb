class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  include SessionsHelper

  rescue_from ActiveRecord::RecordNotFound, with: :rescue_not_found

  class Annotate::NotFoundError < StandardError; end
  rescue_from Annotate::NotFoundError, with: :rescue_not_found

  class Annotate::Unauthorized < StandardError; end
  rescue_from Annotate::Unauthorized, with: :rescue_unauthorized

  protected

  # TODO: add custom 404 page here
  def rescue_not_found
    render "#{Rails.root}/public/404.html", status: 404
  end

  # TODO: redirect to login page if no current user
  def rescue_unauthorized
    render nothing: true, status: 403
  end
end

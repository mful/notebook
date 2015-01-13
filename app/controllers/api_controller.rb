class ApiController < ApplicationController
  protect_from_forgery with: :exception
  respond_to :json
  layout false

  skip_before_filter :bootstrap

  after_action :set_csrf_headers

  protected

  def rescue_not_found
    render nothing: true, status: 404
  end

  def rescue_unauthorized
    render json: { errors: ['Not allowed!'] }, status: 403
  end

  private

  def redirect_or_err(model, path, error_code, path_params = nil, &block)
    if block.call
      redirect_to send(path.to_sym, path_params || model.id)
    else
      errors = model ? model.errors.full_messages : []
      render json: { errors: errors }, status: error_code
    end
  end

  def set_csrf_headers
    response.headers['X-CSRF-Param'] = request_forgery_protection_token.to_s
    response.headers['X-CSRF-Token'] = form_authenticity_token
  end
end

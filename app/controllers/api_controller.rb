class ApiController < ApplicationController
  protect_from_forgery with: :null_session
  respond_to :json
  layout false

  protected

  def rescue_not_found
    render nothing: true, status: 404
  end

  def resuce_unauthorized
    render nothing: true, status: 403
  end

  private
 
  def redirect_or_err(model, path, error_code, path_params = nil, &block)
    if block.call
      redirect_to send(path.to_sym, path_params || model.id)
    else
      render json: { errors: model.errors.full_messages }, status: error_code
    end
  end
end

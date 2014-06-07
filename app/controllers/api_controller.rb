class ApiController < ApplicationController
  protect_from_forgery with: :null_session
  respond_to :json
  layout false

  protected

  def rescue_not_found
    render nothing: true, status: 404
  end

  private
 
  def show_or_400(model, path, &block)
    if block.call
      redirect_to send(path.to_sym, model.id)
    else
      render json: { errors: model.errors.full_messages }, status: 400
    end
  end
end

class Api::SessionsController < ApplicationController

  def new
    render nothing: true
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      sign_in user
      redirect_to api_user_path(id: current_user.id)
    else
      render nothing: true, status: 400
    end
  end

  def create_with_omniauth
    unless request.env['omniauth.auth'] && request.env['omniauth.auth'][:credentials]
      render nothing: true, status: 400
      return
    end

    user = AuthUser.find(request.env['omniauth.auth'])
    sign_in user

    redirect_to api_user_path(id: current_user.id)
  end

  def auth_failure
    render nothing: true, status: 400
  end

  def destroy
    sign_out
    redirect_to root_path
  end
end

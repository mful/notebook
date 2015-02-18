class Api::SessionsController < ApiController

  skip_before_filter :verify_authenticity_token

  def create
    user = User.find_by(email: params[:session][:email].downcase)

    if user && user.authenticate(params[:session][:password]) && sign_in(user)
      redirect_to api_user_path(user.id)
    else
      render json: { errors: ['Email and/or password are not correct'] }, status: 400
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
    render json: {}, status: 200
  end
end

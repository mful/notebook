class Api::UsersController < ApiController
  before_filter :authenticate!, only: [:show, :update]
  before_filter :find_user, only: [:show, :update]

  def new
    @user = User.new
    render json: @user, status: 200
  end

  def create
    @user = User.new(user_params)

    show_or_400 @user, :api_user_path do
      CreateUser.create(@user).persisted? && sign_in(@user)
    end
  end

  def update
    show_or_400(@user, :api_user_path) { @user.update_attributes user_params }
  end

  def show
    render json: @user, status: 200
  end

  def reset_password
    begin 
      ResetPassword.reset! params[:email]
      render nothing: true, status: 200
    rescue AgileLife::NotFoundError => e
      render json:  { errors: ['User with that email does not exist']  }, status: 404
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

  def find_user
    @user = User.find params[:id]
    raise ::AgileLife::NotFoundError unless @user
  end
end

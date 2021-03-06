class Api::UsersController < ApiController
  before_filter :authenticate!, only: [:show, :update]
  before_filter :find_user, only: [:show, :update]

  def new
    @user = User.new
    render json: @user, status: 200
  end

  def create
    @user = User.new(user_params)

    redirect_or_err @user, :api_user_path, 400 do
      CreateUser.create(@user).persisted? && sign_in(@user)
    end
  end

  def update
    redirect_or_err(@user, :api_user_path, 400) do
      @user.update_attributes user_params
    end
  end

  def show
    render json: @user, status: 200, serializer: UserSerializer
  end

  def by_mention
    users = User.by_username(params[:text])
    render json: users, status: 200, each_serializer: AtMentionSerializer
  end

  def reset_password
    begin
      ResetPassword.reset! params[:email]
      render nothing: true, status: 200
    rescue Notebook::NotFoundError => e
      render json:  { errors: ['User with that email does not exist']  }, status: 404
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :username)
  end

  def find_user
    @user = User.find params[:id]
  end

  def authenticate!
    unless signed_in? && current_user.id == params[:id].to_i
      raise Notebook::NotFoundError.new
    end
  end
end

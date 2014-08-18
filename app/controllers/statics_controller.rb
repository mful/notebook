class StaticsController < ApplicationController
  layout 'statics'

  def index
  end

  def signup
    @user = User.new(user_params)
    CreateUser.create(@user)

    if @user.persisted?
      redirect_to thanks_path
    else
      flash[:error] = "Whoops! #{@user.errors.full_messages.join(', ')}"
      render 'index'
    end
  end

  def thanks
  end

  def card
  end

  def sidebar
  end

  def privacy
  end

  private

  def user_params
    password = SecureRandom.base64(20)
    user_attrs = params.require(:user).permit(:email)

    user_attrs.merge(password: password, password_confirmation: password)
  end
end

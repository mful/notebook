class Api::NotificationsController < ApiController

  before_filter :find_notification, only: [:show, :update]
  before_filter :authenticate!, only: [:show, :update]

  def show
    render json: @notification, serializer: NotificationSerializer, status: 200
  end

  def update
    redirect_or_err @notification, :api_notification_path, 400 do
      @notification.update_attributes notification_params
    end
  end

  def current_count
    count = current_user ? current_user.notifications.where(read: false).count : 0
    render json: { notification_count: count }, status: 200
  end

  private

  def authenticate!
    unless current_user && current_user == @notification.user
      raise Notebook::Unauthorized.new
    end
  end

  def find_notification
    @notification = Notification.find(params[:id])
  end

  def notification_params
    params.require(:notification).permit(:read)
  end
end

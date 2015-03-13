class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :username, :notification_count

  def notification_count
    object.notifications.where(read: false).count
  end
end

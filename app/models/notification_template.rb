class NotificationTemplate < ActiveRecord::Base

  belongs_to :event_type

  def self.create_for_event_and_sub(event, subscription)
    event_type = event.event_type
    case event_type.event_type
    when ::EventType::TYPES[:reply]
      self.create_reply_notification(event_type, event, subscription)
    end
  end

  def self.create_reply_notification(event_type, event, sub)
    message = self.find_by_event_type_id(event_type.id).message
    target = event.target
    notifiable = event.notifiable
    initiator = target.user

    while notifiable.annotation_id.blank? do
      notifiable = notifiable.parent_comment
    end

    page = notifiable.annotation.page
    domain = page.entity.base_domain
    message = message % ['@' + initiator.username, domain]

    data = {
      url: page.url,
      comment_id: event.notifiable.id,
      annotation_id: notifiable.annotation_id,
      reply_id: target.id
    }.to_json

    Notification.create(
      user_id: sub.user_id,
      message: message,
      event_id: event.id,
      read: false,
      data: data
    )
  end
end

class NotificationTemplate < ActiveRecord::Base

  belongs_to :event_type

  # TODO: refactor to service
  def self.create_for_event_and_sub(event, subscription)
    event_type = event.event_type
    options = {
      message: self.find_by_event_type_id(event_type.id).message,
      annotation: self.get_annotation(event.notifiable),
    }

    case event_type.event_type
    when ::EventType::TYPES[:reply]
      self.create_reply_notification event_type, event, subscription, options
    when ::EventType::TYPES[:at_mention]
      self.create_mention_notification event_type, event, subscription, options
    when ::EventType::TYPES[:annotation]
      self.create_annotation_notification event_type, event, subscription, options
    end
  end

  def self.create_annotation_notification(event_type, event, sub, options)
    initiator = event.target.user
    message = options[:message] % ['@' + initiator.username, event.notifiable.entity.base_domain]

    data = {
      url: event.notifiable.url,
      comment_id: event.target.id,
      annotation_id: event.target.annotation_id,
      notifiable_id: event.notifiable.id
    }.to_json

    self.create_notification sub, event, message, data
  end

  def self.create_reply_notification(event_type, event, sub, options)
    initiator = event.target.user
    message = options[:message] % ['@' + initiator.username, options[:annotation].page.entity.base_domain]

    data = {
      url: options[:annotation].page.url,
      comment_id: event.notifiable.id,
      annotation_id: options[:annotation].id,
      notifiable_id: event.target.id
    }.to_json

    self.create_notification sub, event, message, data
  end

  def self.create_mention_notification(event_type, event, sub, options)
    return unless options[:annotation]

    initiator = event.notifiable.user
    message = options[:message] % ['@' + initiator.username, options[:annotation].page.entity.base_domain]
    comment = event.notifiable.parent_comment ? event.notifiable.parent_comment : event.notifiable

    data = {
      url: options[:annotation].page.url,
      comment_id: comment.id,
      annotation_id: options[:annotation].id,
      notifiable_id: event.notifiable.id
    }.to_json

    self.create_notification sub, event, message, data
  end

  private

  def self.get_annotation(notifiable)
    if notifiable.respond_to? :annotation_id
      while notifiable && notifiable.annotation_id.blank? do
        notifiable = notifiable.parent_comment
      end

      notifiable.try(:annotation)
    end
  end

  def self.create_notification(sub, event, message, data)
    Notification.create user_id: sub.user_id,
                        message: message,
                        event_id: event.id,
                        read: false,
                        data: data
  end
end

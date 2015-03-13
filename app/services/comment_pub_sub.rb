class CommentPubSub

  def initialize
  end

  def after_create(comment)
    subscribe_owner comment
    post_events comment
  end

  def subscribe_owner(comment)
    # subscribe to replies regardless of whether it's a root level comment or
    # not, in anticipation of increased threading.
    sub = Subscription.create user_id: comment.user_id,
                        notifiable: comment,
                        event_type: ::EventType.find_by_event_type(::EventType::TYPES[:reply])
  end

  def post_events(comment)
    if comment.parent_comment
      ev_type = EventType::TYPES[:reply]
      notifiable = comment.parent_comment
    else
      ev_type = EventType::TYPES[:annotation]
      notifiable = Page.joins(:annotations).where('annotations.id = ?', comment.annotation_id).first
    end

    # create event immediately, for an accurate timestamp
    event = Event.create event_type: EventType.find_by_event_type(ev_type),
                         notifiable: notifiable,
                         target: comment

    NotificationWorker.perform_async event.id
  end
end

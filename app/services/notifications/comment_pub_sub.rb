module Notifications

  class CommentPubSub

    def initialize
    end

    def after_save(comment)
      post_at_mentions comment
      post_annotations comment
      post_replies comment
    end

    def post_annotations(comment)
      subscribe_to_annotations comment
      post_annotation_event comment
    end

    def post_at_mentions(comment)
      events = NotifyAtMentions.new.gogogo(comment)
      subscribe_to_mentions events
      trigger_notifications events
    end

    def post_replies(comment)
      subscribe_to_replies comment
      post_reply_event comment
    end

    private

    def create_event(type, notifiable, comment)
      ev_type = EventType.find_by_event_type(type)

      unless Event.where(event_type: ev_type, notifiable: notifiable, target: comment).first
        Event.create event_type: ev_type,
                     notifiable: notifiable,
                     target: comment
      end
    end

    def post_annotation_event(comment)
      if comment.annotation_id
        ev_type = EventType::TYPES[:annotation]
        notifiable = Page.joins(:annotations).where('annotations.id = ?', comment.annotation_id).first

        NotificationWorker.perform_async create_event(ev_type, notifiable, comment).id
      end
    end

    def post_reply_event(comment)
      if comment.parent_comment
        ev_type = EventType::TYPES[:reply]
        notifiable = comment.parent_comment


        NotificationWorker.perform_async create_event(ev_type, notifiable, comment).id
      end
    end

    def subscribe_to_mentions(events)
      events.map do |event|
        Subscription.create user_id: event.target.id,
                            notifiable_id: event.notifiable_id,
                            notifiable_type: event.notifiable_type,
                            event_type_id: event.event_type_id
      end
    end

    def subscribe_to_replies(comment)
      ev_type = EventType.find_by_event_type(EventType::TYPES[:reply])

      unless comment.subscriptions.joins(:event_type).
                where('event_types.id = ?', ev_type.id).
                where(user_id: comment.user_id).first
        # subscribe to replies regardless of whether it's a root level comment or
        # not, in anticipation of increased threading.
        Subscription.create user_id: comment.user_id,
                            notifiable: comment,
                            event_type: ev_type
      end
    end

    def subscribe_to_annotations(comment)
      if comment.annotation_id
        page = Page.joins(:annotations).where('annotations.id = ?', comment.annotation_id).first
        event_type = ::EventType.find_by_event_type(::EventType::TYPES[:annotation])

        unless comment.user.subscriptions.where(
              notifiable_type: 'Page',
              notifiable_id: page.id,
              event_type_id: event_type.id
            ).first

          Subscription.create(
            user_id: comment.user_id,
            notifiable: page,
            event_type: event_type
          )
        end
      end
    end

    def trigger_notifications(events)
      events.map { |event| NotificationWorker.perform_async event.id }
    end
  end

end

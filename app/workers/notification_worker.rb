class NotificationWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default,
                  retry: true,
                  backtrace: true

  def perform(event_id)
    event = Event.find(event_id)

    ActiveRecord::Base.transaction do
      subscriptions = Subscription.select([:id, :user_id]).where(
        notifiable_id: event.notifiable_id,
        notifiable_type: event.notifiable_type,
        event_type_id: event.event_type_id
      )

      subscriptions.find_each do |sub|
        next unless should_notify?(event, sub)
        res = NotificationTemplate.create_for_event_and_sub event, sub
      end
    end
  end

  private

  def should_notify?(event, sub)
    (event.event_type.event_type == EventType::TYPES[:at_mention] &&
        event.notifiable.user != event.target) ||
      (event.event_type.event_type == EventType::TYPES[:annotation] &&
        event.target.user != sub.user) ||
      (event.event_type.event_type == EventType::TYPES[:reply] &&
        event.notifiable.user != event.target.user)
  end
end

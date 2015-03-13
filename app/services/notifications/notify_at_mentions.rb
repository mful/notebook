module Notifications

  class NotifyAtMentions

    def initialize
    end

    def gogogo(comment)
      new_mentions(
        comment,
        current_mentions(comment)
      ).map { |user| create_event user, comment }
    end

    private

    def create_event(user, comment)
      Event.create event_type: EventType.find_by_event_type(::EventType::TYPES[:at_mention]),
                   notifiable: comment,
                   target: user
    end

    def current_mentions(comment)
      User.joins('INNER JOIN events ON users.id = events.target_id').
         where("events.target_type = ? AND events.id IN \
          (SELECT events.id FROM events \
            WHERE events.notifiable_type = ? \
            AND events.notifiable_id = ? AND \
            events.event_type_id = \
            (SELECT event_types.id FROM event_types \
              WHERE event_types.event_type = ?) \
          )", 'User', 'Comment', comment.id, ::EventType::TYPES[:at_mention])
    end

    def new_mentions(comment, currents)
      potential_mentions(comment).reject { |user| currents.include? user }
    end

    def potential_mentions(comment)
      User.where username: potential_usernames(comment)
    end

    def potential_usernames(comment)
      # remove @ character
      pluck_at_mentions(comment).map { |mention| mention[1..-1] }
    end

    def pluck_at_mentions(comment)
      comment.raw_content.split(/\s+/).select do |word|
        word.match(/@[a-zA-Z0-9_][a-zA-Z0-9_]*/)
      end.uniq
    end
  end

end

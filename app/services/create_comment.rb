class CreateComment

  def self.create(comment, options = {})
    new(comment, options).create
  end

  def initialize(comment, options = {})
    @comment = comment
  end

  def create
    process_presave @comment

    return false unless @comment.save

    process_postsave @comment

    @comment
  end

  private

  def process_presave(comment)
    comment.update_html_content
  end

  def process_postsave(comment)
    add_selfie_vote comment
    subscribe_owner comment
    # post_events comment
  end

  def add_selfie_vote(comment)
    comment.votes << Vote.new(user: comment.user, positive: true)
  end

  def subscribe_owner(comment)
    # subscribe to replies regardless of whether it's a root level comment or
    # not, in anticipation of increased threading.
    Subscription.create user_id: comment.user_id,
                        notifiable: comment,
                        event_type: ::EventType.find_by_event_type(::EventType::TYPES[:reply])
  end
end

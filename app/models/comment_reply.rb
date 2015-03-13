class CommentReply < ActiveRecord::Base
  belongs_to :comment
  belongs_to :reply, class_name: 'Comment'

  validates_uniqueness_of :reply_id, scope: :comment_id

  after_create :trigger_reply_notification

  def trigger_reply_notification
    Notifications::CommentPubSub.new.after_save reply
  end
end

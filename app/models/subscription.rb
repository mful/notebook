class Subscription < ActiveRecord::Base

  belongs_to :user
  belongs_to :notifiable, polymorphic: true
  belongs_to :event_type

  validates_uniqueness_of :notifiable_id,
                          scope: [
                            :notifiable_type,
                            :notifiable_id,
                            :event_type_id,
                            :user_id
                          ]
end

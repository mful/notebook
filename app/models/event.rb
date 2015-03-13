class Event < ActiveRecord::Base

  belongs_to :event_type
  belongs_to :notifiable, polymorphic: true
  belongs_to :target, polymorphic: true
  has_many :notifications
end

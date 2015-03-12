class EventType < ActiveRecord::Base
  TYPES = {
    reply: 'reply',
    annotations: 'annotation'
  }
end

class EventType < ActiveRecord::Base
  TYPES = {
    reply: 'reply',
    annotation: 'annotation'
  }
end

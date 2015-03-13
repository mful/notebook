class EventType < ActiveRecord::Base
  TYPES = {
    reply: 'reply',
    annotation: 'annotation',
    at_mention: 'at_mention',
    general: 'general'
  }
end

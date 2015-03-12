# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Role.create([{ name: 'admin' }, { name: 'moderator' }])
CommentStatus.create([{ name: 'deleted' }, { name: 'removed' }])
EventType.create([
  {event_type: 'reply'},
  {event_type: 'annotation'},
  {event_type: 'general'}
])
NotificationTemplate.create(
  YAML::load(ERB.new(IO.read(Rails.root + "db/seed_data/notification_templates.yml.erb")).result)
)

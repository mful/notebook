FactoryGirl.define do

  factory :subscription do
    event_type factory: :event_type
    user factory: :user
    notifiable factory: :comment
  end
end

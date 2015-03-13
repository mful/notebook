FactoryGirl.define do

  factory :event do
    event_type factory: :event_type
    notifiable factory: :annotation
    target factory: :comment
  end
end

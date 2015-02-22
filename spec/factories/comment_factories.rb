FactoryGirl.define do

  factory :comment do
    content 'Malfoy fucking sucks. srsly.'
    user factory: :user
  end
end

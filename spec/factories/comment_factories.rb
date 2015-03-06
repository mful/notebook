FactoryGirl.define do

  factory :comment do
    raw_content 'Malfoy fucking sucks. srsly.'
    user factory: :user
  end
end

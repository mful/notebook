FactoryGirl.define do
  
  factory :comment do
    content 'Malfoy <h1>fucking</h1> sucks. srsly.'
    user factory: :user
  end
end

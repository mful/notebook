FactoryGirl.define do    

  factory :vote do 
    user factory: :user
    comment factory: :comment
    positive true
  end
end

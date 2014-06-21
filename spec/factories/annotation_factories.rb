FactoryGirl.define do

  factory :annotation do
    page factory: :page
    text '<i>A Beginner\'s Guide to Transfiguration</i>, <em>Switch</em> explores the fundamentals every learner needs to know.'
  end
end

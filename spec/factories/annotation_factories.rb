FactoryGirl.define do

  factory :annotation do
    page factory: :page
    text '<i>A Beginner\'s Guide to Transfiguration</i>, <em>Switch</em> explores the fundamentals every learner needs to know.'
  end

  factory :sama_annotation, parent: :annotation do
    page factory: :sama_page
    text 'In human history, there have been three great technological revolutions
and many smaller ones.'
  end
end

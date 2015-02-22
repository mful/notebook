FactoryGirl.define do

  factory :entity do
    base_domain 'https://www.hogwarts.com/transfiguration#faculty?year=2014'
  end

  factory :sama_entity, parent: :entity do
    base_domain 'http://scribble.test'
  end
end

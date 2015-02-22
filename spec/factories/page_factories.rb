FactoryGirl.define do

  factory :page do
    url 'http://hogwarts.com/library/?subject=transifugration&author=emeric%20switch'
    entity factory: :entity
  end

  factory :sama_page, parent: :page do
    url 'http://scribble.test:31234/tests/sama'
    entity factory: :sama_entity
  end
end

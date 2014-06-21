FactoryGirl.define do 

  factory :page do
    url 'http://hogwarts.com/library/?subject=transifugration&author=emeric%20switch'
    entity factory: :entity
  end
end

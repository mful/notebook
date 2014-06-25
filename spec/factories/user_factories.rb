FactoryGirl.define do
  factory :user do
    email 'hagrid@hogwarts.com'
    password 'Wing4rdiumLev!osa'
    password_confirmation 'Wing4rdiumLev!osa'
  end

  factory :google_user, class: :user do
    pass = SecureRandom.urlsafe_base64
    email 'hagrid@gmail.com'
    password pass
    password_confirmation pass

    after :build do |user|
      user.connections << FactoryGirl.build(:google_connection)
    end
  end

  factory :admin, parent: User do 
    email 'minerva@hogwarts.com'
    password 'tabbycat'
    password_confirmation 'tabbycat'

    after :build do |user|
      admin_role = Role.where(name: 'admin').first || Role.create(name: 'admin')
      user.roles << admin_role
    end
  end

  factory :moderator, parent: User do 
    email 'filch@hogwarts.com'
    password 'quickspell'
    password_confirmation 'quickspell'

    after :build do |user|
      admin_role = Role.where(name: 'moderator').first || Role.create(name: 'moderator')
      user.roles << admin_role
    end
  end
end
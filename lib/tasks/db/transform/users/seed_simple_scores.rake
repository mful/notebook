namespace :db do
  namespace :transform do

    namespace :users do

      desc 'seed simple_score column on users'
      task :seed_simple_scores => [:environment] do
        User.find_each do |user|
          user.send :set_score
        end
      end

    end

  end
end

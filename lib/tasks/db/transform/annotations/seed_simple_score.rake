namespace :db do
  namespace :transform do

    namespace :annotations do

      desc 'seed simple_score column on annotations'
      task :seed_simple_scores => [:environment] do
        Annotation.find_each do |annotation|
          annotation.send :set_score
        end
      end

    end

  end
end

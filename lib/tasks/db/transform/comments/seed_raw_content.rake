require 'reverse_markdown'

namespace :db do
  namespace :transform do

    namespace :comments do

      desc 'convet content to md, to store it that way, rather than as HTML'
      task :seed_raw_content => [:environment] do
        Comment.find_each do |comment|
          md_content = ReverseMarkdown.convert comment.content
          comment.update_attribute :raw_content, md_content
        end
      end

    end

  end
end

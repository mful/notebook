FactoryGirl.define do

  factory :notification do
    event factory: :event
    user factory: :user
    read false
    message '@user replied to your note on nytimes.com'

    after :build do |obj|
      obj.data = {
        annotation_id: Annotation.first.try(:id),
        comment_id: Comment.first.try(:id),
        reply_id: Comment.last.try(:id),
        url: Page.first.try(:url)
      }.to_json
    end
  end
end

require './features/feature_helper'

describe 'viewing an annotation', type: :feature, js: true do
  include AsyncHelper

  let(:user) { FactoryGirl.create :user }
  let(:user_2) { FactoryGirl.create :user, username: 'McGonagol', email: 'mcgonagol@hogwarts.com' }
  let!(:annotation) { FactoryGirl.create :sama_annotation, text: "I think that drastic wealth inequality is likely to be one of the biggest social problems of the next 20 years. [2] We can—and we will—redistribute wealth, but it still doesn’t solve the real problem of people needing something fulfilling to do." }
  let!(:annotation_2) { FactoryGirl.create :sama_annotation, page: annotation.page }
  let(:comment_1) { FactoryGirl.create :comment, annotation: annotation, user: user }
  let(:comment_2) { FactoryGirl.create :comment, annotation: annotation, user: user_2, content: 'moreeeeeeeeeeeee content' }

  before do
    annotation.comments << comment_1
    annotation.comments << comment_2
    visit test_sama_path
  end

  it 'should show the comments on the annotation' do
    wait_for { page.all('.crayon-annotation-text-view').length > 1 }

    page.all("span[data-crayon-key=\"annotation_#{annotation.id}\"]")[0].click
    expect(page.all("span[data-crayon-key=\"annotation_#{annotation.id}\"]").length).to eq(3)

    # ensure clicked annotation is activated
    page.all("span[data-crayon-key=\"annotation_#{annotation.id}\"]").each do |span|
      expect(span[:class]).to match(/crayon-active/)
    end

    # ensure other annotations are not active
    page.all("span[data-crayon-key=\"annotation_#{annotation_2.id}\"]").each do |span|
      expect(span[:class]).not_to match(/crayon-active/)
    end

    within_frame 'crayon-sidebar' do
      expect(page).to have_content(Nokogiri::HTML.parse(comment_1.content).text)
      expect(page).to have_content(Nokogiri::HTML.parse(comment_2.content).text)
      expect(page).to have_content(user.username)
      expect(page).to have_content(user_2.username)
    end
  end
end

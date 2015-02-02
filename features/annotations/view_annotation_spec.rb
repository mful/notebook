require './features/feature_helper'

describe 'viewing an annotation', type: :feature, js: true do
  let(:user) { FactoryGirl.create :user }
  let(:user_2) { FactoryGirl.create :user, username: 'McGonagol', email: 'mcgonagol@hogwarts.com' }
  let(:annotation) { FactoryGirl.create :annotation }
  let(:comment_1) { FactoryGirl.create :comment, annotation: annotation, user: user }
  let(:comment_2) { FactoryGirl.create :comment, annotation: annotation, user: user_2, content: 'moreeeeeeeeeeeee content' }

  before do
    annotation.comments << comment_1
    annotation.comments << comment_2
    visit annotation_path(annotation.id)
  end

  it 'should show the comments on the annotation' do
    expect(page).to have_content(comment_1.content)
    expect(page).to have_content(comment_2.content)
    expect(page).to have_content(user.username)
    expect(page).to have_content(user_2.username)
  end
end

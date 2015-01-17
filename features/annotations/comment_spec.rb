require './features/feature_helper'

describe 'commenting on an annotation', type: :feature, js: true do
  let(:user) { FactoryGirl.create :user }
  let(:comment_attrs) { FactoryGirl.attributes_for :comment }
  let(:annotation) { FactoryGirl.create :annotation }

  before do
    ApplicationController.any_instance.stub(:current_user).and_return(user)
    ApplicationController.any_instance.stub(:signed_in?).and_return(true)
  end

  before do
    visit annotation_path(annotation.id)
    fill_in 'comment_content', with: comment_attrs[:content]
    click_button 'Post'
  end

  it 'should post the comment' do
    expect(find('.comment-content')).to have_content(comment_attrs[:content])
  end
end

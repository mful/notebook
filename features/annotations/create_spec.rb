require "./features/feature_helper"

describe 'creating an annotation', type: :feature, js: true do
  let(:user) { FactoryGirl.create :user }
  let(:annotation_attrs) { FactoryGirl.attributes_for :annotation }
  let(:page_attrs) { FactoryGirl.attributes_for :page }
  let(:params) do
    {
      text: annotation_attrs[:text],
      url: page_attrs[:url]
    }
  end
  let(:comment_content) { 'Hell of a writer, that Emeric Switch.' }

  before do
    ApplicationController.any_instance.stub(:current_user).and_return(user)
    ApplicationController.any_instance.stub(:signed_in?).and_return(true)
  end

  before do
    visit new_annotation_path(params)
    fill_in 'comment_content', with: comment_content
    click_button 'Post'
  end

  it 'should navigate to the annotation url and post the comment' do
    expect(find('.comment-content')).to have_content(comment_content)
    expect(current_path).to eq(annotation_path(Annotation.first.id))
  end
end

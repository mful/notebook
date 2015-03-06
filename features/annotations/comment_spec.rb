require './features/feature_helper'

describe 'commenting on an annotation', type: :feature, js: true do
  include AsyncHelper

  let(:annotation) { FactoryGirl.create :sama_annotation }
  let(:user) { FactoryGirl.create :user }
  let(:admin) { FactoryGirl.create :admin }
  let(:comment_content) { "This is a test comment! @#{admin.username}" }

  before do
    ApplicationController.any_instance.stub(:current_user).and_return user
    ApplicationController.any_instance.stub(:signed_in?).and_return true
    annotation.comments << FactoryGirl.create(:comment, user: admin)
  end

  before do
    visit test_sama_path
  end

  it 'should bring up the sidebar, create a comment, and update the comment list' do
    page.find('.crayon-annotation-text-view').click
    # should activate the annotation
    page.all('.crayon-annotation-text-view').each do |span|
      expect(span[:class]).to match(/crayon-active/)
    end

    # test error handling
    within_frame 'crayon-sidebar' do
      fill_in 'comment_content', with: "Too $hort"
      page.find('.actions input.button').click
    end

    wait_for_alert
    expect(page.driver.browser.switch_to.alert.text.present?).to be_true
    page.driver.browser.switch_to.alert.accept

    # valid comment now
    within_frame 'crayon-sidebar' do
      fill_in 'comment_content', with: comment_content
      page.find('.actions input.button').click

      wait_for { page.all('.author').length > 1 }

      content = page.all('.content').detect { |c| c.text == comment_content }

      expect(page.all('.author').detect { |a| a.text == user.username }.present?).to be_true
      expect(content.present?).to be_true
      expect(content.find('strong')).to have_content("@#{admin.username}")
    end

    # shouldn't make a new annotation
    expect(Annotation.count).to eq(1)
    # should make a comment
    expect(Comment.count).to eq(2)
  end
end

require "./features/feature_helper"

describe 'creating an annotation', type: :feature, js: true do
  include JavaScriptHelper

  let(:user) { FactoryGirl.create :user, password: 'foobar', password_confirmation: 'foobar' }
  let(:comment_attrs) { FactoryGirl.attributes_for :comment }

  before do
    visit test_sama_path
    highlight_text('p', 10, 50)
  end

  it 'bring up the sidebar, with a form to fill out, which should prompt for auth on submission, before working' do
    sleep 1
    page.find('.crayon-add-annotation-view').click

    # ensure full sentence gets highlighted
    expect(page.find '.crayon-annotation-text-view').to have_content("In human history, there have been three great technological revolutions
and many smaller ones.")

    within_frame 'crayon-sidebar' do
      fill_in 'comment_content', with: comment_attrs[:raw_content]
      page.find('.top-actions input.button').click
    end

    within_frame 'crayon-auth-wrapper-frame' do
      page.find('.clickable.email-form-toggle').click
      page.find('.clickable.email-login-toggler').click
      fill_in 'user_email', with: user.email
      fill_in 'user_password', with: 'foobar'
      click_button 'Login'
    end

    within_frame 'crayon-sidebar' do
      sleep 1
      expect(page.find('.author')).to have_content(user.username)
      expect(page.find('.content')).to have_content(comment_attrs[:raw_content])
    end

    expect(Annotation.count).to eq(1)
    expect(Page.count).to eq(1)
    expect(Entity.count).to eq(1)
    expect(Comment.count).to eq(1)
    expect(Annotation.first.text).to eq("In human history, there have been three great technological revolutions
and many smaller ones.")
  end
end

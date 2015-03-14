require "./features/feature_helper"

# NOTE: Google does not provide a mechanism for testing their auth
describe 'the login process', type: :feature, js: true do
  include FbIntegrationHelper

  let(:user) { FactoryGirl.create :user, username: nil, password: 'foobar', password_confirmation: 'foobar' }

  before do
    visit signup_path(referring_action: 'vote')
  end

  describe 'when logging in with email' do

    before do
      find('.email-form-toggle').click
      find('.email-login-toggler').click
      fill_in 'user_email', with: user.email
      fill_in 'password', with: 'foobar'
      click_button 'Login'
      fill_in 'user_username', with: 'hagrid'
      click_button 'Finish'
      sleep 1
    end

    # checking actual session status is tough here. We can assume it worked
    # for the most part, if we get through the before block without errors
    it 'should update the username of the user' do
      user.reload
      expect(user.username).to eq('hagrid')
    end
  end

  describe 'with FB connent' do
    let(:fb_user) { create_fb_test_user installed: false }
    after { destroy_fb_test_user fb_user }

    before do
      click_button 'fb-login'

      within_window 'Facebook' do
        fill_in 'email', with: fb_user['email']
        fill_in 'pass', with: fb_user['password']
        click_button 'Log In'
        click_button 'Okay'
      end

      sleep 1
      fill_in 'user_username', with: 'hagrid'
      click_button 'Finish'

      sleep 1
      visit signup_path
    end

    # checking actual session status is tough here. We can assume it worked
    # for the most part, if we get through the before block without errors
    it 'should update the username of the user' do
      expect(User.first.username).to eq('hagrid')
    end
  end

end

require "./features/feature_helper"

# NOTE: Google does not provide a mechanism for testing their auth
describe 'the login process', type: :feature, js: true do
  include FbIntegrationHelper

  let(:user) { FactoryGirl.create :user, username: nil, password: 'foobar', password_confirmation: 'foobar' }
  let(:return_to) { new_annotation_path }

  before do
    visit signin_path(returnTo: return_to)
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

    it 'should login the user and redirect to the returnTo' do
      expect(current_path).to eq(return_to)
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

      fill_in 'user_username', with: 'hagrid'
      click_button 'Finish'

      sleep 1
    end

    it 'should login the user and redirect to the returnTo' do
      expect(current_path).to eq(return_to)
    end
  end

end

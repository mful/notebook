require "./features/feature_helper"

describe 'email signup', type: :feature, js: true do
  let(:user_attrs) { FactoryGirl.attributes_for :user }

  before do
    visit signup_path(referring_action: 'vote')
    find('.email-form-toggle').click
    fill_in 'user_email', with: user_attrs[:email]
    fill_in 'user_password', with: 'foobar'
    fill_in 'user_password_confirmation', with: 'foobar'
    click_button 'Signup'
    fill_in 'user_username', with: user_attrs[:username]
    click_button 'Finish'
    sleep 1
  end

  # checking actual session status is tough here. We can assume it worked
  # for the most part, if we get through the before block without errors
  it 'should update the username of the user' do
    expect(User.first.username).to eq(user_attrs[:username])
  end
end

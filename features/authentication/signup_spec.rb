require "./features/feature_helper"

describe 'email signup', type: :feature, js: true do
  let(:user_attrs) { FactoryGirl.attributes_for :user }
  let(:return_to) { new_annotation_path }

  before do
    visit signin_path(returnTo: return_to)
    find('.email-form-toggle').click
    fill_in 'user_email', with: user_attrs[:email]
    fill_in 'user_password', with: 'foobar'
    fill_in 'user_password_confirmation', with: 'foobar'
    click_button 'Signup'
    fill_in 'user_username', with: user_attrs[:username]
    click_button 'Finish'
    sleep 1
  end

  it 'should login the user and redirect to the returnTo' do
    expect(current_path).to eq(return_to)
  end
end

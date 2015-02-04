require './features/feature_helper'

describe 'voting on a comment', type: :feature, js: true do
  let(:user) { FactoryGirl.create :user }
  let(:user_2) { FactoryGirl.create :user, username: 'McGonagol', email: 'mcgonagol@hogwarts.com' }
  let(:annotation) { FactoryGirl.create :annotation }
  let(:comment) { FactoryGirl.create :comment, annotation: annotation, user: user }

  before do
    ApplicationController.any_instance.stub(:current_user).and_return(user_2)
    ApplicationController.any_instance.stub(:signed_in?).and_return(true)
    annotation.comments << comment
    visit annotation_path(annotation.id)
  end

  # run many tests in one it block for speed
  it 'should add a vote of the appropriate type, given the user action' do
    expect(find('.vote-count')).to have_content('1')
    find('.up-vote').click
    expect(find('.vote-count')).to have_content('2')
    find('.down-vote').click
    expect(find('.vote-count')).to have_content('1')
  end
end

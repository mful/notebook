require 'spec_helper'
require 'sidekiq/testing'

# NOTE: all cookie tests are done in sessions_controller_spec for convenience
describe SessionsHelper do
  let!(:user) { FactoryGirl.create :user }
  let!(:original_token) { user.remember_token }

  describe '#sign_in' do
    before do
      GATrackWorker.jobs.clear
      sign_in user
    end

    it 'should update the users\'s remember_token' do
      user.reload
      expect(user.remember_token).not_to eq(original_token)
    end

    it 'should set the current user' do
      expect(current_user).to eq(user)
    end

    it 'should queue a GA track worker' do
      expect(GATrackWorker.jobs.size).to eq(1)
    end
  end

  describe '#sign_out' do
    before do
      sign_in user
      sign_out
    end

    it 'should set a new remember_token on the user' do
      user.reload
      expect(user.remember_token).not_to eq(original_token)
    end

    it 'should set the current_user to nil' do
      expect(current_user).to eq(nil)
    end
  end

  describe '#current_user' do
    context 'when there is no current user' do
      it 'should return nil without a token cookie' do
        expect(current_user).to eq(nil)
      end

      context 'but the remember_token and signed cookie are set' do
        before do
          sign_in user
          session.delete(:user_id)
        end

        it 'should return the user' do
          expect(current_user).to eq(user)
        end
      end
    end

    context 'when there is a user is signed_in already' do
      before { sign_in user }

      it 'should set the current user' do
        expect(current_user).to eq(user)
      end
    end
  end

  describe '#signed_in?' do
    context 'when a user is signed in' do
      before { sign_in user }

      it 'should return true' do
        expect(signed_in?).to be_true
      end
    end

    context 'when a user is not signed in' do
      it 'should return false' do
        expect(signed_in?).to be_false
      end
    end
  end

end

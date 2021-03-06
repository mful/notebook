require 'spec_helper'
require 'sidekiq/testing'

describe CreateUser do
  describe '#create' do
    context 'with a valid user' do
      let(:user) { FactoryGirl.build :user }
      before do
        GATrackWorker.jobs.clear
        CreateUser.create user
        @email = MandrillMailer::deliveries.detect { |mail|
          mail.template_name == 'Welcome' &&
          mail.message['to'].any? { |to| to[:email] == user.email }
        }
      end

      it 'should create the user' do
        expect(User.count).to eq(1)
        expect(User.first).to eq(user)
      end

      it 'should send the user a welcome email' do
        expect(@email).to_not be_nil
      end

      it 'should queue an event tracking worker' do
        expect(GATrackWorker.jobs.size).to eq(1)
      end
    end

    context 'with an invalid user' do
      let(:user) { FactoryGirl.build :user, email: '' }
      before { CreateUser.create user  }

      it 'should not create a user' do
        expect(User.count).to eq(0)
      end
    end
  end

end

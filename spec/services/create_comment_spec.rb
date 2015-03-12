require 'spec_helper'
require 'sidekiq/testing'

describe CreateComment do
  let(:user) { FactoryGirl.create :user }
  let!(:reply_type) { FactoryGirl.create :event_type, event_type: EventType::TYPES[:reply] }
  let!(:annotation_type) { FactoryGirl.create :event_type, event_type: EventType::TYPES[:annotation] }

  before do
    NotificationWorker.jobs.clear
  end

  describe '#create' do
    let(:comment) { FactoryGirl.build :comment, user: user }
    let(:expected_content) { "<p>Malfoy fucking sucks. srsly.</p>\n" }
    before { CreateComment.create comment }

    it 'should persist the comment' do
      expect(comment.persisted?).to be_true
    end

    it 'should set the content field to the expected html' do
      expect(comment.content).to eq(expected_content)
    end

    it 'should subscribe the creator to replies' do
      sub = user.subscriptions.where(notifiable: comment).first
      expect(sub.event_type_id).to eq(1)
    end

    it 'should add a vote from the creator' do
      expect(comment.votes.length).to eq(1)
      expect(comment.votes.first.user).to eq(user)
    end

    it 'should create a reply Event' do
      expect(Event.count).to eq(1)
      expect(Event.first.event_type_id).to eq(2)
    end

    it 'should queue a worker' do
      expect(NotificationWorker.jobs.size).to eq(1)
    end
  end
end

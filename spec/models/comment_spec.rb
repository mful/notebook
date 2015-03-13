require 'spec_helper'
require 'sidekiq/testing'

describe Comment do
  let(:user) { FactoryGirl.create :user }
  before do
    NotificationWorker.jobs.clear
  end

  describe '#save' do
    let!(:reply_type) { FactoryGirl.create :event_type, event_type: EventType::TYPES[:reply] }
    let!(:annotation_type) { FactoryGirl.create :event_type, event_type: EventType::TYPES[:annotation] }
    let(:expected_content) { "<p>Malfoy fucking sucks. srsly.</p>\n" }

    context 'with valid data' do
      let!(:comment) { FactoryGirl.create :comment, user: user }

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

      it 'should create a Comment Event' do
        expect(Event.count).to eq(1)
        expect(Event.first.event_type_id).to eq(2)
      end

      it 'should queue a worker' do
        expect(NotificationWorker.jobs.size).to eq(1)
      end
    end

    context 'without a user' do
      let(:comment) { FactoryGirl.build :comment, user: nil }
      before { comment.save }

      it 'should not persist the comment' do
        expect(comment.persisted?).to be_false
      end

      it 'should return an error' do
        expect(comment.errors.full_messages.count).to eq(1)
      end
    end

    context 'with invalid content' do
      let(:comment) { FactoryGirl.build :comment, raw_content: '   ' }
      before { comment.save }

      it 'should not persist' do
        expect(comment.persisted?).to be_false
      end

      it 'should return an error' do
        expect(comment.errors.full_messages.length).to eq(2)
      end
    end
  end

  describe '#destroy' do
    let!(:comment) { FactoryGirl.create :comment }
    let!(:deleted_status) { CommentStatus.create(name: 'deleted') }
    before { comment.destroy }

    it 'should not delete the comment' do
      expect(Comment.count).to eq(1)
    end

    it 'should set the deleted column to true' do
      comment.reload
      expect(comment.deleted?).to be_true
    end
  end

  describe '#set_rating' do
    let!(:comment) { FactoryGirl.create :comment }

    context 'with only the default vote' do
      it 'should set the rating' do
        expect(comment.rating > 0).to be_true
      end
    end

    context 'with votes' do
      let!(:original_rating) { comment.rating }
      let(:user) { FactoryGirl.create :user, email: 'harry@hogwarts.com', username: 'h1' }
      let!(:vote) { FactoryGirl.create :vote, comment: comment, user: user }
      before { comment.save }

      it 'should set the custom rating' do
        expect(comment.rating > original_rating).to be_true
      end
    end
  end

  describe '#parent_comment' do
    let(:comment) { FactoryGirl.create :comment }

    context 'when the comment is a reply' do
      let(:parent) { FactoryGirl.create :comment, user: comment.user }
      before { parent.replies << comment }

      it 'should return the parent comment' do
        expect(comment.parent_comment).to eq(parent)
      end
    end

    context 'when the comment is not a reply' do
      it 'should return nil' do
        expect(comment.parent_comment).to be_nil
      end
    end
  end

  describe '#simple_score' do
    let(:user) { FactoryGirl.create :user }
    let(:user_2) { FactoryGirl.create :admin }
    let(:user_3) { FactoryGirl.create :moderator }
    let(:comment) { FactoryGirl.create :comment, user: user }
    before do
      FactoryGirl.create :vote, comment: comment, user: user_2
      FactoryGirl.create :vote, positive: false, comment: comment, user: user_3
    end

    it 'should return the difference between positive and negative votes' do
      expect(comment.simple_score).to eq(1)
    end
  end
end

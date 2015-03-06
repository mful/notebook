require 'spec_helper'

describe Comment do

  describe '#create' do
    let(:user) { FactoryGirl.create :user }

    context 'with valid data' do
      before { @comment = FactoryGirl.create :comment, user: user }

      it 'should add a vote by the author' do
        expect(@comment.votes.length).to eq(1)
        expect(@comment.votes.first.user).to eq(user)
      end
    end
  end

  describe '#save' do

    context 'with valid data' do
      let!(:comment) { FactoryGirl.create :comment }

      it 'should create the comment' do
        expect(Comment.count).to eq(1)
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

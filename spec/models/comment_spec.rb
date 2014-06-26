require 'spec_helper'

describe Comment do
  
  describe '#save' do

    context 'with valid data' do
      let!(:comment) { FactoryGirl.create :comment }

      it 'should create the comment' do
        expect(Comment.count).to eq(1)
      end

      it 'should strip the HTML' do
        expect(comment.content).to eq('Malfoy fucking sucks. srsly.')
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
      let(:comment) { FactoryGirl.build :comment, content: '   ' }
      before { comment.save }

      it 'should not persist' do
        expect(comment.persisted?).to be_false
      end

      it 'should return an error' do
        expect(comment.errors.full_messages.length).to eq(1)
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

    context 'without votes' do
      it 'should set the rating to the default value' do
        expect(comment.rating).to eq(Comment::DEFAULT_RATING)
      end
    end

    context 'with votes' do
      let(:user) { FactoryGirl.create :user, email: 'harry@hogwarts.com' }
      let!(:vote) { FactoryGirl.create :vote, comment: comment, user: user }
      before { comment.set_rating }

      it 'should set the custom rating' do
        expect(comment.rating != Comment::DEFAULT_RATING && comment.rating > 0).to be_true
      end
    end
  end
end

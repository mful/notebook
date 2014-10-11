require 'spec_helper'

describe Api::CommentsController do
  include SessionsHelper
  
  describe '#create' do
    let(:comment) { FactoryGirl.attributes_for :comment }
    let!(:user) { FactoryGirl.create :user }

    context 'when the user is signed in' do
      before { sign_in user }

      context 'with valid data' do
        let(:annotation) { FactoryGirl.create :annotation }
        before { post :create, comment: comment, annotation_id: annotation.id }

        it 'should create the comment' do
          expect(Comment.count).to eq(1)
        end

        it 'should redirect/return the comment' do
          expect(response).to redirect_to(api_comment_path(Comment.first.id))
        end
      end

      context 'without an associated annotation' do
        let(:comment) { FactoryGirl.attributes_for :comment, content: '  ' }
        before { post :create, comment: comment }

        it 'should return 404' do
          expect(response.status).to eq(404)
        end

        it 'should not create a comment' do
          expect(Comment.count).to eq(0)
        end
      end

      context 'with invalid comment data' do
        let(:annotation) { FactoryGirl.create :annotation }
        let(:comment) { FactoryGirl.attributes_for :comment, content: '  ' }
        before { post :create, comment: comment, annotation_id: annotation.id }

        it 'should return 400' do
          expect(response.status).to eq(400)
        end

        it 'should not create a comment' do
          expect(Comment.count).to eq(0)
        end
      end
    end

    context 'when the user is not signed it' do
      before { post :create, comment: comment }

      it 'should return 403' do
        expect(response.status).to eq(403)
      end
    end
  end

  describe '#update' do
    let(:user) { FactoryGirl.create :user }
    let!(:comment) { FactoryGirl.create :comment, user: user }
    let(:comment_update) { { content: 'EDIT: Malfoy is <em>not</em> very nice' } }

    context 'when the proper user is logged in' do
      before { sign_in user }

      context 'with valid data' do
        before { put :update, id: comment.id, comment: comment_update }

        it 'should update the comment' do
          expect(Comment.first.content).to eq('EDIT: Malfoy is not very nice')
        end

        it 'should return the comment' do
          expect(response).to redirect_to(api_comment_path(comment.id))
        end 
      end

      context 'with invalid data' do
        let(:comment_update) { { content: '<em></em>' } }
        before { put :update, id: comment.id, comment: comment_update }

        it 'should return 400' do
          expect(response.status).to eq(400)
        end
      end
    end

    context 'when a different, regular user is logged in' do
      let(:user2) { FactoryGirl.create :user, email: 'snape@hogwarts.com', username: 's' }
      before do 
        sign_in user2
        put :update, id: comment.id, comment: comment_update
      end

      it 'should return 403' do
        expect(response.status).to eq(403)
      end
    end

    context 'as a moderator' do
      let(:moderator) { FactoryGirl.create :moderator }
      before do
        sign_in moderator
        put :update, id: comment.id, comment: comment_update 
      end

      it 'should update the comment' do
        expect(Comment.first.content).to eq('EDIT: Malfoy is not very nice')
      end
    end

    context 'when no user is logged in' do
      before { put :update, id: comment.id, comment: comment_update }

      it 'should return 403' do
        expect(response.status).to eq(403)
      end
    end
  end

  describe '#destroy' do
    let!(:comment) { FactoryGirl.create :comment, user: user }
    let!(:deleted_status) { CommentStatus.create(name: 'deleted') }
    let!(:user) { FactoryGirl.create :user } 

    context 'when the proper user is logged in' do
      before do
        sign_in user
        delete :destroy, id: comment.id
      end

      it 'should set the deleted flag on the comment' do
        expect(Comment.first.deleted?).to eq(true)
      end
    end

    context 'when the proper user is not logged in' do
      before { delete :destroy, id: comment.id }

      it 'should return 403' do
        expect(response.status).to eq(403)
      end

      it 'should not update the comment' do
        expect(Comment.first.deleted?).to be_false
      end
    end

    context 'as a moderator' do
      let(:moderator) { FactoryGirl.create :moderator }
      before do
        sign_in moderator
        delete :destroy, id: comment.id
      end

      it 'should set the deleted flag on the comment' do
        expect(Comment.first.deleted?).to eq(true)
      end
    end
  end

  describe '#show' do
    context 'when the comment exists' do
      let!(:comment) { FactoryGirl.create :comment }
      before { get :show, id: comment.id }

      it 'should return the comment' do
        expect(JSON.parse(response.body)['comment']['id']).to eq(comment.id)
      end
    end

    context 'when the comment does not exist' do
      before { get :show, id: 1 }

      it 'should return 404' do
        expect(response.status).to eq(404)
      end
    end
  end

  describe '#flag' do 
    let(:comment) { FactoryGirl.create :comment }

    context 'when not signed in' do
      before { post :flag, id: comment.id }

      it 'should return 403' do
        expect(response.status).to eq(403)
      end
    end

    context 'when signed in' do 
      let(:user) { FactoryGirl.create :user, email: 'hagrid@eowls.com', username: 'h2' }
      before { sign_in user }

      context 'as a user who has already flagged the comment' do
        before do 
          comment.comment_flags << CommentFlag.new(user: user)
          comment.save
          post :flag, id: comment.id
        end

        it 'should return 400' do
          expect(response.status).to eq(400)
        end
      end

      context 'as a user who has NOT already flagged the comment' do 
        before { post :flag, id: comment.id }

        it 'should add a flag to the comment' do
          comment.reload
          expect(comment.comment_flags.count).to eq(1)
        end
      end
    end
  end

end

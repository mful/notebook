require 'spec_helper'

describe Api::CommentsController do
  include SessionsHelper
  
  describe '#create' do
    let(:comment) { FactoryGirl.attributes_for :comment }
    let!(:user) { FactoryGirl.create :user }

    context 'when the user is signed in' do
      before { sign_in user }

      context 'with valid data' do
        before { post :create, comment: comment }

        it 'should create the comment' do
          expect(Comment.count).to eq(1)
        end

        it 'should redirect/return the comment' do
          expect(response).to redirect_to(api_comment_path(Comment.first.id))
        end
      end

      context 'with invalid data' do
        let(:comment) { FactoryGirl.attributes_for :comment, content: '  ' }
        before { post :create, comment: comment }

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
    let!(:comment) { FactoryGirl.create :comment, user: user }
    let(:comment_update) { { content: 'EDIT: Malfoy is <em>not</em> very nice' } } 
    let!(:user) { FactoryGirl.create :user } 

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

    context 'when a different user is logged in' do
      let(:user2) { FactoryGirl.create :user, email: 'snape@hogwarts.com' }
      before do 
        sign_in user2
        put :update, id: comment.id, comment: comment_update
      end

      it 'should return 404' do
        expect(response.status).to eq(404)
      end
    end

    context 'when no user is logged in' do
      before { put :update, id: comment.id, comment: comment_update }

      it 'should return 404' do
        expect(response.status).to eq(404)
      end
    end
  end

  describe '#destroy' do
    let!(:comment) { FactoryGirl.create :comment, user: user }
    let!(:user) { FactoryGirl.create :user } 

    context 'when the proper user is logged in' do
      before do
        sign_in user
        delete :destroy, id: comment.id
      end

      it 'should set the deleted flag on the comment' do
        expect(Comment.first.deleted).to eq(true)
      end
    end

    context 'when the proper user is not logged in' do
      before { delete :destroy, id: comment.id }

      it 'should return 404' do
        expect(response.status).to eq(404)
      end

      it 'should not update the comment' do
        expect(Comment.first.deleted).to be_false
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
end

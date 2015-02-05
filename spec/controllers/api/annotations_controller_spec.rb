require 'spec_helper'
require 'sidekiq/testing'

describe Api::AnnotationsController do
  include SessionsHelper

  describe '#create' do
    let(:comment) { FactoryGirl.attributes_for :comment }
    let(:annotation) { FactoryGirl.attributes_for :annotation }

    context 'when signed in' do
      let(:user) { FactoryGirl.create :user }
      before { sign_in user }

      context 'with valid data' do
        before { post :create, annotation: annotation, comment: comment, url: 'http://hogwarts.com' }

        it 'should create the annotation' do
          expect(Annotation.count).to eq(1)
        end

        it 'should redirect to/return the annotation' do
          expect(response).to redirect_to(api_annotation_path(Annotation.first.id))
        end
      end

      context 'with invalid data' do
        let(:invalid_annotation) { annotation.merge(text: nil) }
        before { post :create, annotation: invalid_annotation, comment: comment, url: 'http://hogwarts.com' }

        it 'should return 400' do
          expect(response.status).to eq(400)
        end

        it 'should not create an annotation' do
          expect(Annotation.count).to eq(0)
        end
      end
    end

    context 'when not signed in' do
      before { post :create, annotation: annotation, comment: comment, url: 'http://hogwarts.com' }

      it 'should return 403' do
        expect(response.status).to eq(403)
      end
    end
  end

  describe 'show' do
    context 'when the annotation exists' do
      let(:annotation) { FactoryGirl.create :annotation }
      before { get :show, id: annotation.id }

      it 'should return the annotation' do
        expect(JSON.parse(response.body)['annotation']['id']).to eq(annotation.id)
      end
    end

    context 'when the comment does not exist' do
      before { get :show, id: 1 }

      it 'should return 404' do
        expect(response.status).to eq(404)
      end
    end
  end

  describe '#by_page' do
    context 'when the page exists' do
      context 'and the page has annotations' do
        let(:annotation) { FactoryGirl.create :annotation }
        let(:expected_res) do
          [FullAnnotationSerializer.new(annotation).serializable_hash.stringify_keys]
        end
        before do
          GATrackWorker.drain
          get :by_page, url: annotation.page.url
        end

        it 'should return an array of serialized annotations' do
          expect(JSON.parse(response.body)['annotations']).to eq(expected_res)
        end

        it 'should queue a GA track worker' do
          expect(GATrackWorker.jobs.size).to eq(1)
        end
      end

      context 'and the page does not have any annotations yet' do
        let(:page) { FactoryGirl.create :page }
        before { get :by_page, url: page.url }

        it 'should return an empty array of annotations' do
          expect(JSON.parse(response.body)['annotations']).to eq([])
        end
      end
    end

    context 'when the page does not exist' do
      before { get :by_page, url: 'http://test.com' }

      it 'should return an empty array of annotations' do
        expect(JSON.parse(response.body)['annotations']).to eq([])
      end
    end
  end

end

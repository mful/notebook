require 'spec_helper'
require 'sidekiq/testing'

describe Api::AnnotationsController do
  include SessionsHelper

  before { Rails.application.load_seed }

  describe '#create' do
    let(:user) { FactoryGirl.create :user }
    let(:user2) { FactoryGirl.create :admin }
    let(:comment) { FactoryGirl.attributes_for :comment, raw_content: "this is a comment with a @#{user2.username} mention" }
    let(:annotation) { FactoryGirl.attributes_for :annotation }
    let(:page) { FactoryGirl.create :page }

    context 'when signed in' do
      before do
        existing_annotation = FactoryGirl.create :annotation, page: page, text: 'some different text'
        existing_annotation.comments << FactoryGirl.create(:comment, user: user2)
        sign_in user
      end

      context 'with valid data' do
        before do
          post :create, annotation: annotation, comment: comment, url: page.url

          NotificationWorker.drain
          @ev_types = user2.notifications.map do |notification|
            notification.event.event_type.event_type
          end
        end

        it 'should create the annotation' do
          expect(Annotation.count).to eq(2)
        end

        it 'should redirect to/return the annotation' do
          expect(response).to redirect_to(api_annotation_path(Annotation.last.id))
        end

        it 'should notify previous annotators of that page, and those who are @mentioned' do
          expect(user2.notifications.count).to eq(2)
          expect(@ev_types.include? 'at_mention').to be_true
          expect(@ev_types.include? 'annotation').to be_true
        end
      end

      context 'with invalid data' do
        let(:invalid_annotation) { annotation.merge(text: nil) }
        before { post :create, annotation: invalid_annotation, comment: comment, url: 'http://hogwarts.com' }

        it 'should return 400' do
          expect(response.status).to eq(400)
        end

        it 'should not create a new annotation' do
          expect(Annotation.count).to eq(1)
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

  describe '#show' do
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
          [AnnotationHighlightSerializer.new(annotation).serializable_hash.stringify_keys]
        end
        before do
          GATrackWorker.jobs.clear
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

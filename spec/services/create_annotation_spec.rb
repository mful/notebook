require 'spec_helper'
require 'sidekiq/testing'

describe CreateAnnotation do
  let(:user) { FactoryGirl.create :user }

  describe '#create' do
    let(:comment_params) { FactoryGirl.attributes_for(:comment).merge(user: user) }

    context 'when the page exists' do
      let!(:page) { FactoryGirl.create :page }
      let(:annotation) { FactoryGirl.attributes_for :annotation, page: nil }

      context 'and there is not an annotation on that page with the same text' do
        before do
          GATrackWorker.drain
          CreateAnnotation.create annotation, page.url, comment_params
        end

        it 'should create the annotation' do
          expect(Annotation.count).to eq(1)
        end

        it 'should associate the annotation with the page' do
          expect(Annotation.first.page).to eq(page)
        end

        it 'should not create a new entity' do
          expect(Page.count).to eq(1)
        end

        it 'should queue a GA track worker' do
          expect(GATrackWorker.jobs.size).to eq(1)
        end
      end

      context 'and there is already an annotation on that page with the same text' do
        let!(:existing_annotation) { FactoryGirl.create :annotation, page: page }
        let!(:initial_comment_count) { existing_annotation.comments.size }
        before do
          GATrackWorker.drain
          CreateAnnotation.create annotation, page.url, comment_params
        end

        it 'should not create a new annotation' do
          expect( Annotation.count ).to eq(1)
        end

        it 'should add a comment to that annotation' do
          existing_annotation.reload
          expect( existing_annotation.comments.size ).to eq(initial_comment_count + 1)
        end

        it 'should NOT queue a GA track worker' do
          expect(GATrackWorker.jobs.size).to eq(0)
        end
      end
    end

    context 'when the page does not exist' do
      let(:annotation) { FactoryGirl.attributes_for :annotation, page: nil }
      before do
        GATrackWorker.drain
        CreateAnnotation.create(
          annotation,
          'http://hogwarts.com/transfiguration',
          comment_params
        )
      end

      it 'should create the page' do
        expect(Annotation.count).to eq(1)
      end

      it 'should associate the page with the new entity' do
        expect(Annotation.first.page).to eq(Page.first)
      end

      it 'should create a new entity' do
        expect(Page.count).to eq(1)
      end

      it 'should queue a GA track worker' do
        expect(GATrackWorker.jobs.size).to eq(1)
      end
    end

    context 'with invalid annotation data' do
      let(:annotation) { FactoryGirl.attributes_for :annotation, text: 'blah' }
      before do
        GATrackWorker.drain
        @res = CreateAnnotation.create(
          annotation,
          'http://hogwarts.com/transfiguration',
          comment_params
        )
      end

      it 'should not persist the annotation' do
        expect(@res.persisted?).to be_false
      end

      it 'should NOT queue a GA track worker' do
        expect(GATrackWorker.jobs.size).to eq(0)
      end
    end

    context 'with an invalid comment' do
      let!(:page) { FactoryGirl.create :page }
      let(:annotation) { FactoryGirl.attributes_for :annotation, page: nil }
      let(:bad_params) { { content: comment_params[:content] } }
      before do
        GATrackWorker.drain
        @res = CreateAnnotation.create(
          annotation,
          'http://hogwarts.com/transfiguration',
          bad_params
        )
      end

      it 'should not persist the annotation' do
        expect(@res.persisted?).to be_false
      end

      it 'should NOT queue a GA track worker' do
        expect(GATrackWorker.jobs.size).to eq(0)
      end
    end
  end
end

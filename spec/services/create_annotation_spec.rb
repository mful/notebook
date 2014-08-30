require 'spec_helper'

describe CreateAnnotation do
  let(:user) { FactoryGirl.create :user }
  
  describe '#create' do
    let(:comment_params) { FactoryGirl.attributes_for(:comment).merge(user: user) }

    context 'when the page exists' do
      let!(:page) { FactoryGirl.create :page }
      let(:annotation) { FactoryGirl.build :annotation, page: nil }
      before { CreateAnnotation.create annotation, page.url, comment_params }

      it 'should create the annotation' do
        expect(Annotation.count).to eq(1)
      end

      it 'should associate the annotation with the page' do
        expect(Annotation.first.page).to eq(page)
      end

      it 'should not create a new entity' do
        expect(Page.count).to eq(1)
      end
    end

    context 'when the page does not exist' do
      let(:annotation) { FactoryGirl.build :annotation, page: nil }
      before do
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
    end

    context 'with invalid annotation data' do
      let(:annotation) { FactoryGirl.build :annotation, text: 'blah' }
      before do
        @res = CreateAnnotation.create(
          annotation,
          'http://hogwarts.com/transfiguration',
          comment_params
        )
      end

      it 'should return false' do
        expect(@res).to be_false
      end
    end

    context 'with an invalid comment' do
      let!(:page) { FactoryGirl.create :page }
      let(:annotation) { FactoryGirl.build :annotation, page: nil }
      let(:bad_params) { { content: comment_params[:content] } }
      before do
        @res = CreateAnnotation.create(
          annotation,
          'http://hogwarts.com/transfiguration',
          bad_params
        )
      end

      it 'should return false' do
        expect(@res).to be_false
      end
    end
  end
end

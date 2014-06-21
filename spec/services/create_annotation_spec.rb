require 'spec_helper'

describe CreateAnnotation do
  
  describe '#create' do
    context 'when the page exists' do
      let!(:page) { FactoryGirl.create :page }
      let(:annotation) { FactoryGirl.build :annotation, page: nil }
      before { CreateAnnotation.create annotation, page.url }

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
      before { CreateAnnotation.create annotation, 'http://hogwarts.com/transfiguration' }
    
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

    context 'with invalid data' do
      let(:annotation) { FactoryGirl.build :annotation, text: 'blah' }
      before { @res = CreateAnnotation.create(annotation, 'http://hogwarts.com/transfiguration') }

      it 'should return false' do
        expect(@res).to be_false
      end
    end
  end
end

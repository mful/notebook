require 'spec_helper'

describe Annotation do

  describe '#save' do
    context 'with valid data' do
      let!(:annotation) { FactoryGirl.create :annotation }

      it 'should create the annotation' do
        expect(Annotation.count).to eq(1)
      end
    end

    context 'with invalid text' do
      let(:annotation) { FactoryGirl.build :annotation, text: 'muggle'*500 }
      before { annotation.save }

      it 'should not create the annotation' do
        expect(Annotation.count).to eq(0)
      end

      it 'should set errors' do
        expect(annotation.errors.full_messages.present?).to be_true
      end
    end

    context 'when there is no page' do
      let(:annotation) { FactoryGirl.build :annotation, page: nil }
      before { annotation.save }

      it 'should not create the annotation' do
        expect(Annotation.count).to eq(0)
      end

      it 'should set errors' do
        expect(annotation.errors.full_messages.present?).to be_true
      end
    end
  end
end

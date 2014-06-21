require 'spec_helper'

describe CreatePage do
  
  describe '#create' do
    context 'when the entity exists' do
      let!(:entity) { FactoryGirl.create :entity }
      let(:page) { FactoryGirl.build :page, entity: nil }
      before { CreatePage.create page }

      it 'should create the page' do
        expect(Page.count).to eq(1)
      end

      it 'should associate the page with the entity' do
        expect(Page.first.entity).to eq(entity)
      end

      it 'should not create a new entity' do
        expect(Entity.count).to eq(1)
      end
    end

    context 'when the entity does not yet exist' do
      let(:page) { FactoryGirl.build :page }
      before { CreatePage.create page }

      it 'should create the page' do
        expect(Page.count).to eq(1)
      end

      it 'should associate the page with the new entity' do
        expect(Page.first.entity).to eq(Entity.first)
      end

      it 'should create a new entity' do
        expect(Entity.count).to eq(1)
      end
    end
  end
end

require 'spec_helper'

describe Entity do

  describe '#save' do

    context 'with valid data' do
      let(:entity) { FactoryGirl.create :entity }
      let(:base_domain) { 'hogwarts.com' }

      it 'should strip everything but the base domain' do
        expect(entity.base_domain).to eq(base_domain)
      end
    end

    context 'with invalid data' do
      let(:entity) { { base_domain: 'asdfasdf' } }
      before { @entity = Entity.create(entity) }

      it 'should fail to save' do
        expect(@entity.persisted?).to be_false
      end

      it 'should return errors' do
        expect(@entity.errors.full_messages.length).to eq(1)
      end
    end
  end
end

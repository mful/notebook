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
        expect(@entity.errors.full_messages.present?).to be_true
      end
    end
  end

  describe '.find_or_create_by_url' do
    let(:url) { 'http://faculty.hogwarts.com/transfiguration?search=mcgonagol' }
    let!(:entity) { FactoryGirl.create :entity }

    context 'when the entity already exists' do
      it 'should find the entity' do
        expect(Entity.find_or_create_by_url(url)).to eq(entity)
      end
    end

    context 'when the entity does not exist' do
      let(:url) { 'http://durmstrang.com' }

      it 'should create the entity' do
        expect(Entity.find_or_create_by_url(url).persisted?).to be_true
      end
    end
  end

end

require 'spec_helper'

describe Api::EntitiesController do 

  describe '#create' do
    context 'with valid data' do
      let(:entity) { FactoryGirl.attributes_for :entity }
      before { post :create, entity: entity }

      it 'should create a entity' do
        expect(Entity.count).to eq(1)
      end

      it 'should return the new entity' do
        expect(response).to redirect_to(api_entity_path(Entity.first))
      end
    end

    context 'with invalid data' do
      let(:entity) { { base_domain: 'asdfasdfas' } }
      before { post :create, entity: entity }

      it 'should return 400' do
        expect(response.status).to eq(400)
      end
    end
  end

  describe '#show' do
    context 'when the entity exists' do
      let(:entity) { FactoryGirl.create(:entity) }
      before { get :show, id: entity.id }

      it 'should return the entity as JSON' do
        expect(JSON.parse(response.body)['entity']['id']).to eq(entity.id)
      end
    end

    context 'when the entity does not exist' do
      before { get :show, id: 1 }

      it 'should 404' do
        expect(response.status).to eq(404)
      end
    end
  end

  describe '#update' do
    let!(:entity) { FactoryGirl.create :entity }

    context 'with valid data' do
      let(:url) { 'http://durmstrang.com/potions/recipes?polyjuice' }
      before { put :update, id: entity.id, entity: entity.attributes.merge(base_domain: url) }

      it 'should update the entity' do
        entity.reload
        expect(entity.base_domain).to eq('durmstrang.com')
      end
    end

    context 'with invalid data' do
      let(:url) { 'asdfasdf' }
      before do
        put :update, id: entity.id, entity: entity.attributes.merge(base_domain: url)
      end

      it 'should return errors' do
        expect(JSON.parse(response.body)['errors'].present?).to be_true
      end

      it 'should return 400' do
        entity.reload
        expect(response.status).to eq(400)
      end
    end
  end
end

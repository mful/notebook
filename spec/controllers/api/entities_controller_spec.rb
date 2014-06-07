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
end

require 'spec_helper'

describe Api::PagesController  do

  describe '#create' do
    before do
      request.stub(:url).and_return(FactoryGirl.attributes_for(:page)[:url])
    end

    context 'when the entity exists' do
      let!(:entity) { FactoryGirl.create :entity }
      let(:page) { FactoryGirl.attributes_for :page }
      before { post :create, page: page }

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
      let(:page) { FactoryGirl.attributes_for :page }
      before { post :create, page: page }

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

  describe '#update' do
    let!(:page) { FactoryGirl.create :page }

    context 'with valid data' do
      let(:url) { 'http://hogwarts.com/potions/recipes?polyjuice' }
      before { put :update, id: page.id, page: page.attributes.merge(url: url) }

      it 'should update the page' do
        page.reload
        expect(page.url).to eq('hogwarts.com/potions/recipes?polyjuice')
      end
    end

    context 'with invalid data' do
      let(:url) { 'asdfasdf' }
      before do
        put :update, id: page.id, page: page.attributes.merge(url: url)
      end

      it 'should return errors' do
        expect(JSON.parse(response.body)['errors'].present?).to be_true
      end

      it 'should return 400' do
        page.reload
        expect(response.status).to eq(400)
      end
    end
  end

  describe '#show' do
    let(:page) { FactoryGirl.create :page }
    before { get :show, id: page.id }

    it 'should return the page' do
      expect(JSON.parse(response.body)['page']['id']).to eq(page.id)
    end
  end
end

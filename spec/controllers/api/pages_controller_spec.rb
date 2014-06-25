require 'spec_helper'

describe Api::PagesController  do
  include SessionsHelper

  describe '#create' do
    let(:page) { FactoryGirl.attributes_for :page }

    context 'as an admin' do
      let(:admin) { FactoryGirl.create :admin }
      before { sign_in admin }

      context 'with valid data' do
        before { post :create, page: page }

        it 'should create the page' do
          expect(Page.count).to eq(1)
        end

        it 'should redirect/return the entity' do
          expect(response).to redirect_to(api_page_path(Page.first.id))
        end
      end

      context 'with invalid data' do
        let(:page) { FactoryGirl.attributes_for :page, url: 'asdfadf' }
        before { post :create, page: page }

        it 'should return 400' do
          expect(response.status).to be(400)
        end
      end
    end

    context 'as a regular user' do
      let(:user) { FactoryGirl.create :user }
      before do
        sign_in user
        post :create, page: page
      end

      it 'should return 404' do
        expect(response.status).to eq(404)
      end
    end
  end

  describe '#update' do
    let!(:page) { FactoryGirl.create :page }

    context 'as an admin' do
      let(:admin) { FactoryGirl.create :admin }
      before { sign_in admin }

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

    context 'as a regular user' do
      let(:user) { FactoryGirl.create :user }
      let(:url) { 'asdfasdf' }
      before do
        sign_in user
        put :update, id: page.id, page: page.attributes.merge(url: url)
      end

      it 'should return 404' do
        expect(response.status).to eq(404)
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

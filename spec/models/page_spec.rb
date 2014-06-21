require 'spec_helper'

describe Page do

  describe '#save' do
    context 'with valid data' do
      let(:page) do FactoryGirl.build(
        :page, 
        url: 'http://hogwarts.com/library/?author=emeric%20switch#animagus'
      )
      end
      let(:stripped_url) { 'hogwarts.com/library/?author=emeric%20switch' }
      before { page.save }

      it 'should create a page' do
        expect(Page.count).to eq(1)
      end

      it 'should strip the fragment from the URL' do
        expect(Page.first.url).to eq(stripped_url)
      end
    end

    context 'with invalid data' do
      let(:page) { FactoryGirl.build :page, url: 'stupify!' }
      before { page.save }

      it 'should not create a page' do
        expect(Page.count).to eq(0)
      end

      it 'should add errors' do
        expect(page.errors.full_messages.length).not_to eq(0)
      end
    end
  end
end

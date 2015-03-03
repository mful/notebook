require 'spec_helper'

describe Page do

  describe '#save' do
    context 'with valid data' do
      let(:page) do FactoryGirl.build(
        :page,
        url: 'http://hogwarts.com/library?author=emeric%20switch#animagus'
      )
      end
      let(:stripped_url) { 'hogwarts.com/library' }
      before { page.save }

      it 'should create a page' do
        expect(Page.count).to eq(1)
      end

      it 'should strip the protocol, fragment, and query string from the URL' do
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

  describe '.find_or_create_by_url' do
    let!(:page) { FactoryGirl.create :page }
    let(:url) { FactoryGirl.attributes_for(:page)[:url] }

    context 'when the page already exists' do
      it 'should find the page' do
        expect(Page.find_or_create_by_url(url)).to eq(page)
      end

      it 'should not create a new page' do
        Page.find_or_create_by_url(url)
        expect(Page.count).to eq(1)
      end
    end

    context 'when the page does not exist' do
      let(:url) { 'http://durmstrang.com/transfiguration' }
      before { Page.find_or_create_by_url(url) }

      it 'should create the page' do
        expect(Page.count).to eq(2)
      end
    end
  end
end

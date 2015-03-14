require 'spec_helper'

describe FetchPageAnnotations do
  before { Rails.application.load_seed }

  describe '#fetch' do
    let(:page) { FactoryGirl.create :page }

    describe 'when there are no associated annotations' do
      let(:fetcher) { FetchPageAnnotations.new(page) }

      describe 'and there is a notification, requiring a specific annotation' do
        it 'should return an empty array' do
          expect(fetcher.fetch({ cryn_aid: [1] })).to eq([])
        end
      end

      describe 'and there is not a notification' do
        it 'should return an empty array' do
          expect(fetcher.fetch {}).to eq([])
        end
      end
    end

    describe 'when there is no page' do
      let(:fetcher) { FetchPageAnnotations.new(nil) }

      it 'should return an empty array' do
        expect(fetcher.fetch {}).to eq([])
      end
    end

    describe 'when there are annotations associated with the page' do
      let(:fetcher) { FetchPageAnnotations.new(page) }

      before do
        @annotations = []

        11.times do
          @annotations << FactoryGirl.create(:annotation, page: page)
          # to proxy difference in created_at, for recency preference
          sleep 0.1
        end

        # ensure there is an annotation that will not be auto-selected for score or recency reasons
        @notified_annotation = @annotations[0]
        @notified_annotation.update_column :created_at, 5.days.ago
        user = FactoryGirl.create :user
        @annotations.each do |annotation|
          next if annotation == @notified_annotation
          res = annotation.comments << FactoryGirl.build(:comment, user: user)
        end
      end

      describe 'and a specific annotation is NOT needed' do
        it 'should return the expected default set of annotations' do
          expect(fetcher.fetch.include?(@notified_annotation)).to be_false
        end
      end

      describe 'and a specific annotation is needed for a notification' do
        it 'should return a list of annotations, included the desired annotation' do
          expect(fetcher.fetch({ cryn_aid: [@notified_annotation.id] }).include?(@notified_annotation)).to be_true
        end
      end
    end
  end
end





































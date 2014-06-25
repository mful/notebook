require 'fast_helper'
require './app/models/concerns/rateable'

describe Rateable do
  include Rateable

  describe '#calculate_rating' do
    it 'should return the proper rating for a negative score' do
      expect(calculate_rating(-5, 10) < 0).to be_true
    end

    it 'should return the proper rating for a 0 score' do
      expect(calculate_rating(0, 10)).to eq(0)
    end

    it 'should return the proper rating for a positve score' do
      expect(calculate_rating(5, 10) > 0).to be_true
    end

    it 'should return the proper rating for a positve n' do
      expect(calculate_rating(5, 10) > 0).to be_true
    end  

    context 'with a default rating specified' do 
      let(:default_rating) { 0.25 }

      it 'should return the default for a negative n' do
        expect(calculate_rating(5, -10, default_rating: default_rating)).to eq(default_rating)
      end

      it 'should return the default for a 0 n' do
        expect(calculate_rating(0, 0, default_rating: default_rating)).to eq(default_rating)
      end
    end

    context 'without a default rating specified' do 
      it 'should return the 0 for a negative n' do
        expect(calculate_rating(5, -10)).to eq(0)
      end

      it 'should return 0 rating for a 0 n' do
        expect(calculate_rating(0, 0)).to eq(0)
      end
    end  
  end

end

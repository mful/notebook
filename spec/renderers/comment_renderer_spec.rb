require 'fast_helper'
require 'redcarpet'
require './app/renderers/comment_renderer'

describe CommentRenderer do
  let(:renderer) { CommentRenderer.new }

  describe '#wrap_at_mentions' do

    context 'when given text with @-mentions' do
      let(:content) { '@test this @thing out@gmail.com @now' }
      let(:expected_res) { '**@test** this **@thing** out@gmail.com **@now**' }

      it 'should return the expected MD' do
        expect(renderer.send :wrap_at_mentions, content).to eq(expected_res)
      end
    end

    context 'when given text without @-mentions' do
      let(:content) { 'test **this** thing out@gmail.com now' }
      let(:expected_res) { 'test **this** thing out@gmail.com now' }

      it 'should return the text as is' do
        expect(renderer.send :wrap_at_mentions, content).to eq(expected_res)
      end
    end
  end
end

class CommentRenderer < Redcarpet::Render::HTML

  def header(text, header_level)
    "<p><strong>#{text}</strong></p>"
  end

  def preprocess(text)
    wrap_at_mentions text
  end

  private

  def wrap_at_mentions(text)
    text.gsub(/(?<=^|\s)(@[a-zA-Z0-9_][a-zA-Z0-9_]*)/, '**\1**')
  end
end

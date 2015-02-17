class CommentRenderer < Redcarpet::Render::HTML

  def header(text, header_level)
    "<p><strong>#{text}</strong></p>"
  end
end

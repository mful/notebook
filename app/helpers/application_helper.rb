module ApplicationHelper

  def open_graph(graph = {})
    @og_props = graph
  end

  def page_title(text = nil, options = {})
    @page_title ||= if options[:replace]
                      text
                    elsif text.present?
                      "#{text} - Scribble"
                    else
                      "Annotate the Web - Scribble"
                    end
  end
end

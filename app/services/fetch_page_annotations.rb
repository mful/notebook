class FetchPageAnnotations

  def self.fetch(page, options = {})
    new(page).fetch(options)
  end

  def initialize(page)
    @page = page
  end

  def fetch(options = {})
    return [] unless @page

    @annotations = @page.default_page_annotations.to_a
    if options[:cryn_aid].present? && options[:cryn_aid][0].present?
      @annotations = include_specific_annotation(options[:cryn_aid][0])
    end

    return @annotations
  end

  private

  def include_specific_annotation(id)
    unless @annotations.collect(&:id).include? id
      @annotations.pop
      @annotations << Annotation.find_by_id(id)
    end

    @annotations.compact
  end
end

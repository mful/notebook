class CreateAnnotation

  def self.create(annotation, url, options = {})
    new(annotation, url, options).create
  end

  def initialize(annotation, url, options = {})
    @annotation = annotation
    @url = url
  end

  def create
    associate_page
    @annotation.save ? @annotation : false
  end

  private

  def associate_page
    page = Page.find_or_create_by_url(@url)
    @annotation.page = page
  end
end

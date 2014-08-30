class CreateAnnotation

  def self.create(annotation, url, comment_params, options = {})
    new(annotation, url, comment_params, options).create
  end

  def initialize(annotation, url, comment_params, options = {})
    @annotation = annotation
    @url = url
    @comment_params = comment_params
  end

  def create
    associate_page
    associate_comment

    @annotation.save ? @annotation : false
  end

  private

  def associate_page
    page = Page.find_or_create_by_url(@url)
    @annotation.page = page
  end

  def associate_comment
    @annotation.comments << Comment.new(@comment_params)
  end
end

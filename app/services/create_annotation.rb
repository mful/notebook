class CreateAnnotation

  def self.create(annotation, url, comment_params, options = {})
    new(annotation, url, comment_params, options).create
  end

  def initialize(annotation_params, url, comment_params, options = {})
    @annotation = Annotation.new(annotation_params)
    @url = url
    @comment_params = comment_params
  end

  def create
    associate_page
    associate_comment
    track_create if @annotation.save

    @annotation
  end

  private

  def associate_page
    page = Page.find_or_create_by_url(@url)
    @annotation = ensure_new_annotation(page, @annotation)
    @annotation.page = page
  end

  def associate_comment
    @annotation.comments << Comment.new(@comment_params)
  end

  def ensure_new_annotation(page, candidate)
    dupe = page.annotations.find do |annotation|
      annotation.text.strip == candidate.text.strip
    end

    dupe ? dupe : candidate
  end

  def track_create
    GATrackWorker.perform_async 'Create Annotation', @annotation.page.url
  end
end

class CreatePage

  def self.create(page, options = {})
    new(page, options).create
  end

  def initialize(page, options = {})
    @page = page
  end

  def create
    associate_entity
    @page.save ? @page : false
  end

  private

  def associate_entity
    entity = Entity.find_or_create_by_url(@page.url)
    @page.entity = entity
  end
end

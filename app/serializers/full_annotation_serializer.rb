class FullAnnotationSerializer < ActiveModel::Serializer
  root :annotation
  attributes :id, :text, :url, :base_domain

  has_many :comments, serializer: CommentSerializer

  def url
    object.page.url
  end

  def base_domain
    object.page.entity.base_domain
  end
end

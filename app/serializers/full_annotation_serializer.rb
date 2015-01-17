class FullAnnotationSerializer < ActiveModel::Serializer
  root :annotation
  attributes :id, :text, :url, :base_domain, :comments

  def url
    object.page.url
  end

  def base_domain
    object.page.entity.base_domain
  end

  def comments
    object.comments.order('rating DESC').map do |comment|
      CommentSerializer.new(comment).serializable_hash
    end
  end
end

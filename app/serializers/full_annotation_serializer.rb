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
    # pulled from DB with comments -- use sort_by to prevent additional DB read
    # triggered by #order
    object.comments.sort_by { |comment| -1 * comment.rating }.map do |comment|
      CommentSerializer.new(comment).serializable_hash(current_user: serialization_options[:current_user])
    end
  end
end

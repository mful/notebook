class CommentSerializer < ActiveModel::Serializer
  # TODO: add rating, flags, etc
  attributes :id, :content, :author, :annotation_id

  def author
    object.user.username
  end

  def annotation_id
    object.annotation_id
  end
end

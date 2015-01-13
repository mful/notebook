class CommentSerializer < ActiveModel::Serializer

  attributes :id, :content, :author, :annotation_id
  has_many :replies, each_serializer: CommentSerializer

  def author
    object.user.username
  end

  def annotation_id
    object.annotation_id
  end
end

class CommentSerializer < ActiveModel::Serializer

  attributes :id, :content, :author, :annotation_id, :replies, :rating,
             :created_at, :updated_at

  def author
    object.user.username
  end

  def annotation_id
    object.annotation_id
  end

  def replies
    object.replies.order('rating DESC').map do |reply|
      CommentSerializer.new(reply).serializable_hash
    end
  end
end

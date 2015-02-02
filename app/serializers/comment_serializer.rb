class CommentSerializer < ActiveModel::Serializer

  attributes :id, :content, :author, :annotation_id, :rating,
             :created_at, :updated_at, :score

  def author
    object.user.username
  end

  def annotation_id
    object.annotation_id
  end

  def score
    object.simple_score
  end
end

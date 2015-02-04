class CommentSerializer < ActiveModel::Serializer

  attributes :id, :content, :author, :annotation_id, :rating,
             :created_at, :updated_at, :score, :current_user_vote

  def author
    object.user.username
  end

  def annotation_id
    object.annotation_id
  end

  def current_user_vote
    if serialization_options[:current_user]
      vote =
        object.votes.find_by_user_id(serialization_options[:current_user].id)

      if vote
        vote.positive ? 'up' : 'down'
      end
    end
  end

  def score
    object.simple_score
  end
end

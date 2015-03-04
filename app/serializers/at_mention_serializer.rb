class AtMentionSerializer < ActiveModel::Serializer
  root :user

  attributes :id, :username
end

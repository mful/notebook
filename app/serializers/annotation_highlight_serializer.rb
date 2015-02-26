class AnnotationHighlightSerializer < ActiveModel::Serializer
  root :annotation
  attributes :id, :text
end

class NotificationSerializer < ActiveModel::Serializer
  attributes :id, :url, :message, :read

  def url
    data = JSON.parse object.data
    base_url = data['url']

    case object.event.event_type.event_type
    when 'reply'
      query_params = {
        cryn_cid: data['comment_id'],
        cryn_aid: data['annotation_id'],
        cryn_id: data['reply_id'],
        cryn_type: 'reply'
      }
      query = query_params.map { |k,v| "#{k}=#{v}" }.join('&')
      url = "http://#{base_url}?#{query}"
    end

    return url
  end
end

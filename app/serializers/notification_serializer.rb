class NotificationSerializer < ActiveModel::Serializer
  attributes :id, :url, :message, :read

  def url
    data = JSON.parse object.data
    base_url = data['url']
    query_params = {
      cryn_cid: data['comment_id'],
      cryn_aid: data['annotation_id'],
      cryn_id: data['notifiable_id']
    }

    case object.event.event_type.event_type
    when 'reply'
      query_params[:cryn_type] = 'reply'
    when 'at_mention'
      query_params[:cryn_type] = 'at_mention'
    when 'annotation'
      query_params[:cryn_type] = 'annotation'
    end

    assemble_url base_url, query_params
  end

  private

  def assemble_url(base_url, query_params)
    query = query_params.map { |k,v| "#{k}=#{v}" }.join('&')
    "http://#{base_url}?#{query}"
  end
end

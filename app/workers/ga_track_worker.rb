class GATrackWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default,
                  retry: true,
                  backtrace: true

  def perform(category, action = nil, label = nil, value = nil)
    gabba_client.event category, action.to_s, label.to_s, value
  end

  private

  def gabba_client
    @gabba_client ||= Gabba::Gabba.new(
      Notebook::Application.config.google_analytics[:tracking_code],
      Notebook::Application.config.google_analytics[:host]
    )
  end
end

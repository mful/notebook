class SessionsController < ApplicationController

  layout 'janus'

  def signin
  end

  def signup
    @presenter = {
      server_rendered: true,
      referringAction: params[:referring_action]
    }
  end
end

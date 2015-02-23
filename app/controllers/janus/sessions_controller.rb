class Janus::SessionsController < ApplicationController

  layout 'janus'

  def signup
    @presenter = {
      server_rendered: true,
      referringAction: params[:referring_action]
    }
  end
end

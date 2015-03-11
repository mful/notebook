class Corkboard::StaticsController < ApplicationController

  layout 'corkboard'

  def intro
    @presenter = {
      pencil_image_path: ActionController::Base.helpers.asset_path('pencil_purple.svg')
    }
  end
end

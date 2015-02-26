class Ledger::AnnotationsController < ApplicationController

  layout 'ledger'

  before_filter :find_annotation, only: [:show]

  def new
    @presenter = {
      text: params[:text],
      url: params[:url],
      logo: ActionController::Base.helpers.asset_path('logo.png')
    }
  end

  def show
    serialized_annotation =
      FullAnnotationSerializer.new(@annotation).serializable_hash current_user: current_user

    @presenter = {
      annotation: serialized_annotation,
      comments: serialized_annotation[:comments],
      server_rendered: true,
      submission_type: 'comment',
      logo: ActionController::Base.helpers.asset_path('logo.png')
    }
  end

  private

  def find_annotation
    @annotation = Annotation.includes(:comments).find(params[:id])
  end
end

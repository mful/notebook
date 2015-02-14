class Ledger::AnnotationsController < ApplicationController

  layout 'ledger'

  before_filter :find_annotation, only: [:show, :add_comment]

  def show
    serialized_annotation =
      FullAnnotationSerializer.new(@annotation).serializable_hash current_user: current_user

    @presenter = {
      annotation: serialized_annotation,
      comments: serialized_annotation[:comments],
      server_rendered: true,
      logo: ActionController::Base.helpers.asset_path('logo.png')
    }
  end

  private

  def find_annotation
    @annotation = Annotation.find(params[:id])
  end
end

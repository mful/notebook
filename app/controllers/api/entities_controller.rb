class Api::EntitiesController < ApiController

  def create
    @entity = Entity.new(entity_params)
    show_or_400(@entity, :api_entity_path) { @entity.save }
  end

  def show
    @entity = Entity.find(params[:id])
    render json: { entity: @entity }, status: 200
  end

  private

  def entity_params
    params.require(:entity).permit(:base_domain)
  end
end

class Api::EntitiesController < ApiController

  def create
    @entity = Entity.new(entity_params)
    redirect_or_err(@entity, :api_entity_path, 400) { @entity.save }
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

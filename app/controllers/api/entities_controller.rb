class Api::EntitiesController < ApiController
  before_filter :find_entity, only: [:show, :update]
  before_filter :authenticate!, only: [:update, :create]

  def create
    @entity = Entity.new(entity_params)
    redirect_or_err(@entity, :api_entity_path, 400) { @entity.save }
  end

  def show
    render json: { entity: @entity }, status: 200
  end

  def update
    redirect_or_err @entity, :api_entity_path, 400 do 
      @entity.update_attributes entity_params
    end
  end

  private

  def authenticate!
    raise Annotate::NotFoundError unless can? :manage, Entity
  end

  def find_entity
    @entity = Entity.find(params[:id])
  end

  def entity_params
    params.require(:entity).permit(:base_domain)
  end
end

class Api::PagesController < ApiController
  before_filter :find_page, only: [:show, :update]

  def show
    render json: { page: @page }, status: 200
  end

  def create
    @page = Page.new(page_params)
    entity = Entity.find_or_create_by_url(request.url)
    @page.entity = entity
    redirect_or_err(@page, :api_page_path, 400) { @page.save }
  end

  def update
    redirect_or_err @page, :api_page_path, 400 do 
      @page.update_attributes page_params
    end
  end

  private

  def page_params
    params.require(:page).permit(:url)
  end

  def find_page
    @page = Page.find(params[:id])
  end
end

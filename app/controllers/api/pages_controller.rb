class Api::PagesController < ApiController
  before_filter :find_page, only: [:show, :update]
  before_filter :authenticate!, only: [:update, :create]

  def show
    render json: { page: @page }, status: 200
  end

  def create
    @page = Page.new(page_params)
    redirect_or_err(@page, :api_page_path, 400) { CreatePage.create @page }
  end

  def update
    redirect_or_err @page, :api_page_path, 400 do 
      @page.update_attributes page_params
    end
  end

  private

  def authenticate!
    raise Notebook::NotFoundError unless can? :manage, Page
  end

  def page_params
    params.require(:page).permit(:url)
  end

  def find_page
    @page = Page.find(params[:id])
  end
end

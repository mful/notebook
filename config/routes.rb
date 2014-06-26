Annotate::Application.routes.draw do
  mount Peek::Railtie => '/peek'
  root to: 'pages#index'

  namespace :api do 
    resources :users, only: [:new, :create, :show, :update]
    get 'signup' => 'users#new'
    get 'reset_password' => 'users#reset_password'

    resources :sessions, only: [:create]
    delete 'signout' => 'sessions#destroy', as: 'signout'

    resources :entities, only: [:create, :show, :update]
    resources :pages, only: [:create, :update, :show]

    resources :comments, only: [:create, :update, :show, :destroy]
    post 'comments/:id/flag' => 'comments#flag', as: 'api_flag_comment'

    resources :annotations, only: [:create, :show]
  end

  get '/signin' => 'sessions#new'
  
  get '/auth/:provider/callback' => 'api/sessions#create_with_omniauth'
  get '/auth/failure' => 'api/sessions#auth_failure'
end

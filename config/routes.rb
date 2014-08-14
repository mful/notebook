Annotate::Application.routes.draw do
  mount Peek::Railtie => '/peek'
  root to: 'statics#index'

  get 'card' => 'statics#card'
  get 'sidebar' => 'statics#sidebar'

  namespace :api do 
    resources :users, only: [:new, :create, :show, :update]
    get 'signup' => 'users#new'
    get 'reset_password' => 'users#reset_password'

    resources :sessions, only: [:create]
    delete 'signout' => 'sessions#destroy', as: 'signout'

    resources :entities, only: [:create, :show, :update]
    resources :pages, only: [:create, :update, :show]

    resources :comments, only: [:create, :update, :show, :destroy]
    post 'comments/:id/flag' => 'comments#flag', as: 'flag_comment'

    resources :annotations, only: [:create, :show]
    post 'annotations/:id/comments' => 'annotations#add_comment', as: 'annotation_comments'
  end

  get '/signin' => 'sessions#new'
  post '/sessions' => 'sessions#create', as: 'sessions'
  
  get '/auth/:provider/callback' => 'api/sessions#create_with_omniauth'
  get '/auth/failure' => 'api/sessions#auth_failure'

  resources :annotations, only: [:show]
  post 'annotations/:id/comments' => 'annotations#add_comment', as: 'annotation_comments'
end

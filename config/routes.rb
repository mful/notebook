Notebook::Application.routes.draw do
  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)
  mount Peek::Railtie => '/peek'
  root to: 'statics#index'

  post '/hello/signup' => 'statics#signup'
  get '/thanks' => 'statics#thanks'
  get '/privacy' => 'statics#privacy'

  get 'card' => 'statics#card'
  get 'sidebar' => 'statics#sidebar'

  namespace :api do
    resources :users, only: [:new, :create]
    get 'users/:id' => 'users#show', constraints: { id: /\d+/ }, as: 'user'
    post 'users/:id' => 'users#update'
    get 'signup' => 'users#new'
    get 'reset_password' => 'users#reset_password'
    get 'users/by_mention' => 'users#by_mention'

    resources :sessions, only: [:create]
    delete 'signout' => 'sessions#destroy', as: 'signout'

    resources :entities, only: [:create, :show, :update]
    resources :pages, only: [:create, :update, :show]

    resources :comments, only: [:create, :update, :show, :destroy]
    post 'comments/:id/flag' => 'comments#flag', as: 'flag_comment'
    post 'comments/:id/replies' => 'comments#add_reply', as: 'comment_replies'
    get 'comments/:id/replies' => 'comments#replies'
    post 'comments/:id/votes' => 'comments#add_vote', as: 'comment_votes'

    get 'annotations/by_page' => 'annotations#by_page', as: 'page_annotations'
    resources :annotations, only: [:create, :show, :new]
    post 'annotations/:id/comments' => 'annotations#add_comment', as: 'annotation_comments'
  end

  post '/sessions' => 'sessions#create', as: 'sessions'

  get '/auth/:provider/callback' => 'api/sessions#create_with_omniauth', as: 'api_omniauth_login'
  get '/auth/failure' => 'api/sessions#auth_failure'

  post 'annotations/:id/comments' => 'annotations#add_comment', as: 'annotation_comments'

  ### Janus ###

  get '/signup' => 'janus/sessions#signup', as: 'signup'

  ### Ledger ###

  get 'annotations/:id' => 'ledger/annotations#show', constraints: { id: /\d+/ }, as: 'annotation'
  get 'annotations/new' => 'ledger/annotations#new', as: 'new_annotation'

  get 'comments/:id' => 'ledger/comments#show', constraints: { id: /\d+/ }, as: 'comment'

  ### Corkboard ###

  get 'notifications' => 'corkboard/notifications#index', as: 'notifications'
  get 'cork/login' => 'corkboard/statics#intro', as: 'corkboard_intro'
end

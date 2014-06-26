class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    
    if user.has_role?('admin')
      can :manage, :all
    elsif user.has_role?('moderator')
      can :delete, Comment
      can :edit, Comment
    end

    can :delete, Comment, user_id: user.id
    can :edit, Comment, user_id: user.id
  end
end

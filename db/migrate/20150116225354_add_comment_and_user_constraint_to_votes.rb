class AddCommentAndUserConstraintToVotes < ActiveRecord::Migration
  def change
    add_index :votes, [:user_id, :comment_id], unique: true
  end
end

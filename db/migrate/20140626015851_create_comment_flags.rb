class CreateCommentFlags < ActiveRecord::Migration
  def change
    create_table :comment_flags do |t|
      t.integer :comment_id
      t.integer :user_id
    end

    add_index :comment_flags, [:comment_id, :user_id], unique: true
  end
end

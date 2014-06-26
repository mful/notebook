class CreateCommentReplies < ActiveRecord::Migration
  def change
    create_table :comment_replies, id: false do |t|
      t.integer :comment_id
      t.integer :reply_id
      t.timestamps
    end

    add_index :comment_replies, [:comment_id, :reply_id], unique: true
  end
end

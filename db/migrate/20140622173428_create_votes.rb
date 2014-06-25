class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :user_id
      t.integer :comment_id
      t.boolean :positive

      t.timestamps
    end

    add_column :comments, :rating, :float, default: 0
    add_index :votes, :comment_id
  end
end

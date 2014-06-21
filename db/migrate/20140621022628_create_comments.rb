class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.text :content
      t.integer :user_id
      t.boolean :deleted, default: false
    end

    add_column :pages, :comment_id, :integer
  end
end

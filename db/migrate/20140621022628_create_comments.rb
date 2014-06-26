class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.text :content
      t.integer :user_id
      t.integer :comment_status_id
    end

    create_table :comment_statuses do |t|
      t.string :name
    end

    add_column :pages, :comment_id, :integer
  end
end

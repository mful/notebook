class AddRawContentColumn < ActiveRecord::Migration
  def change
    add_column :comments, :raw_content, :text
  end
end

class CreateAnnotations < ActiveRecord::Migration
  def change
    create_table :annotations do |t|
      t.text :text
      t.integer :page_id
    end

    add_column :comments, :annotation_id, :integer
    add_index :annotations, :page_id
    add_index :comments, :annotation_id
  end
end

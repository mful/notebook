class CreateEntities < ActiveRecord::Migration
  def change
    create_table :entities do |t|
      t.string :base_domain

      t.timestamps
    end

    add_index :entities, :base_domain, unique: true
  end
end

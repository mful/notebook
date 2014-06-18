class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :url
      t.integer :entity_id

      t.timestamps
    end
  end
end

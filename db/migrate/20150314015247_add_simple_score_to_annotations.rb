class AddSimpleScoreToAnnotations < ActiveRecord::Migration
  def change
    add_column :annotations, :simple_score, :decimal, precision: 22, scale: 15, default: 0.0
  end
end

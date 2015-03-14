class AddSimpleScoreToUsers < ActiveRecord::Migration
  def change
    add_column :users, :simple_score, :integer, default: 1
  end
end

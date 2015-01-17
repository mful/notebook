class AddTimestampsToSomeTables < ActiveRecord::Migration
  TABLES = [:annotations, :comment_flags, :comment_statuses, :comments, :roles_users]

  def up
    TABLES.each do |table|
      change_table(table) { |t| t.timestamps }
    end
  end

  def down
    TABLES.each do |table|
      remove_column table, :created_at
      remove_column table, :updated_at
    end
  end
end

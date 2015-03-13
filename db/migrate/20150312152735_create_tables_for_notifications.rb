class CreateTablesForNotifications < ActiveRecord::Migration
  def up
    create_table :event_types do |t|
      t.string :event_type
      t.timestamps
    end

    add_index :event_types, :event_type

    create_table :events do |t|
      t.integer :event_type_id
      t.string :notifiable_type
      t.integer :notifiable_id
      t.string :target_type
      t.integer :target_id

      t.timestamps
    end

    add_index :events, [:notifiable_type, :notifiable_id]
    add_index :events, [:target_type, :target_id]
    add_index :events, :event_type_id

    create_table :subscriptions do |t|
      t.integer :user_id
      t.integer :notifiable_id
      t.string :notifiable_type
      t.integer :event_type_id

      t.timestamps
    end

    add_index :subscriptions,
              [:notifiable_type, :notifiable_id, :event_type_id],
              name: 'index_subscriptions_on_notifiable_and_event_type'

    create_table :notifications do |t|
      t.integer :user_id
      t.integer :event_id
      t.boolean :read, default: false
      t.string :message
      t.text :data

      t.timestamps
    end

    add_index :notifications, :user_id

    create_table :notification_templates do |t|
      t.string :message
      t.integer :event_type_id
      t.timestamps
    end
  end

  def down
    drop_table :event_types
    drop_table :events
    drop_table :subscriptions
    drop_table :notifications
    drop_table :notification_templates
  end
end

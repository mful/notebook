require 'spec_helper'
require 'sidekiq/testing'
require 'ostruct'

describe Notifications::CommentPubSub do
  let(:pub_sub) { Notifications::CommentPubSub.new }

  before do
    Rails.application.load_seed
    NotificationWorker.jobs.clear
  end

  describe '#after_save' do
    let(:user) { FactoryGirl.create :user }
    let(:user2) { FactoryGirl.create :admin }
    let(:comment) { FactoryGirl.create :comment, user: user }
    let(:ev_type) { EventType.find_by_event_type 'annotation' }

    describe 'when the comment is the direct child of an annotation' do
      let(:annotation) { FactoryGirl.create :annotation }

      context 'and has already been pub-subbed' do

        before do
          annotation.comments << comment

          Event.stub(:create).and_call_original
          Subscription.stub(:create).and_call_original
          NotificationWorker.jobs.clear

          pub_sub.after_save comment
        end

        it 'should not create new subscriptions' do
          expect(Subscription).not_to have_received(:create)
        end

        it 'should not fire new events' do
          expect(Event).not_to have_received(:create)
        end

        it 'should not queue any notifications' do
          expect(NotificationWorker.jobs.length).to eq(0)
        end
      end

      context 'and has not yet been pub-subbed' do
        before do
          # prevent default pub-sub
          Comment.any_instance.stub(:setup_notifications)

          annotation.comments << comment

          Event.stub(:create).and_call_original
          Subscription.stub(:create).and_call_original
          NotificationWorker.jobs.clear

          pub_sub.after_save comment
        end

        it 'should subscribe the comment user to replies and future annotations on that page' do
          expect(Subscription).to have_received(:create).twice
          expect(
            Subscription.where(
              user: user,
              notifiable: annotation.page,
              event_type: ev_type
            ).size
          ).to eq(1)
          expect(
            Subscription.where(
              user: user,
              notifiable: comment,
              event_type: EventType.find_by_event_type('reply')
            ).size
          ).to eq(1)
        end

        it 'should fire off an annotation event' do
          expect(Event).to have_received(:create).once
          expect(
            Event.where(
              target: comment,
              notifiable: annotation.page,
              event_type: ev_type
            ).size
          ).to eq(1)
        end

        it 'should queue a notification worker' do
          expect(NotificationWorker.jobs.size).to eq(1)
        end
      end
    end

    describe 'when the comment is a reply' do
      let(:parent) { FactoryGirl.create :comment, user: user2 }

      context 'and has already been pub-subbed' do

        before do
          parent.replies << comment

          Event.stub(:create).and_call_original
          Subscription.stub(:create).and_call_original
          NotificationWorker.jobs.clear

          pub_sub.after_save comment
        end

        it 'should not create new subscriptions' do
          expect(Subscription).not_to have_received(:create)
        end

        it 'should not fire new events' do
          expect(Event).not_to have_received(:create)
        end

        it 'should not queue any notifications' do
          expect(NotificationWorker.jobs.length).to eq(0)
        end
      end

      context 'and has not yet been pub-subbed' do
        let(:ev_type) { EventType.find_by_event_type 'reply' }

        before do
          # prevent default pub-sub
          CommentReply.any_instance.stub(:trigger_reply_notification)

          parent.replies << comment

          Event.stub(:create).and_call_original
          Subscription.stub(:create).and_call_original
          NotificationWorker.jobs.clear

          pub_sub.after_save comment
        end

        it 'should subscribe the comment user to replies only' do
          expect(Subscription).to have_received(:create).once
          expect(
            Subscription.where(
              user: user,
              notifiable: comment,
              event_type: ev_type
            ).size
          ).to eq(1)
        end

        it 'should fire off a reply event' do
          expect(Event).to have_received(:create).once
          expect(
            Event.where(
              target: comment,
              notifiable: parent,
              event_type: ev_type
            ).size
          ).to eq(1)
        end

        it 'should queue a notification worker' do
          expect(NotificationWorker.jobs.size).to eq(1)
        end
      end
    end

    describe 'when the comment has @-mentions' do
      let(:user3) { FactoryGirl.create :moderator }
      let(:mention_comment) { FactoryGirl.create :comment, user: user, raw_content: "test test test @#{user2.username}"  }
      let(:annotation) { FactoryGirl.create :annotation }
      let(:ev_type) { EventType.find_by_event_type 'at_mention' }

      context 'and has already been pub-subbed' do

        before do
          annotation.comments << mention_comment
        end

        context 'and there are new @-mentions in the content' do

          before do
            # prevent default pub-sub
            Comment.any_instance.stub(:setup_notifications)

            mention_comment.raw_content = "test @#{user3.username} test test @#{user2.username}"
            mention_comment.save

            Event.stub(:create).and_call_original
            Subscription.stub(:create).and_call_original
            NotificationWorker.jobs.clear

            pub_sub.after_save mention_comment
          end

          it 'should create a subscription for each new @-mention' do
            expect(Subscription).to have_received(:create).once
            expect(
              Subscription.where(
                user: user3,
                notifiable: mention_comment,
                event_type: ev_type
              ).size
            ).to eq(1)
          end

          it 'should create an event for each new @-mention' do
            expect(Event).to have_received(:create).once
            expect(
              Event.where(
                target: user3,
                notifiable: mention_comment,
                event_type: ev_type
              ).size
            ).to eq(1)
          end

          it 'should queue a notification worker for each new @-mention' do
            expect(NotificationWorker.jobs.size).to eq(1)
          end
        end

        context 'and there are no new @-mentions in the content' do

          before do
            Event.stub(:create).and_call_original
            Subscription.stub(:create).and_call_original
            NotificationWorker.jobs.clear

            pub_sub.after_save mention_comment
          end

          it 'should not create new subscriptions' do
            expect(Subscription).not_to have_received(:create)
          end

          it 'should not fire new events' do
            expect(Event).not_to have_received(:create)
          end

          it 'should not queue any notifications' do
            expect(NotificationWorker.jobs.length).to eq(0)
          end
        end
      end

      context 'and has not yet been pub-subbed' do

        before do
          # prevent default pub-sub
          Comment.any_instance.stub(:setup_notifications)

          annotation.comments << mention_comment
          NotificationWorker.jobs.clear

          pub_sub.after_save mention_comment
        end

        it 'should create a subscription for each @-mention' do
            expect(
              Subscription.where(
                user: user2,
                notifiable: mention_comment,
                event_type: ev_type
              ).size
            ).to eq(1)
          end

          it 'should create an event for each @-mention' do
            expect(
              Event.where(
                target: user2,
                notifiable: mention_comment,
                event_type: ev_type
              ).size
            ).to eq(1)
          end

          it 'should queue a notification worker for each @-mention' do
            # +1 for annotation notifications
            expect(NotificationWorker.jobs.size).to eq(2)
          end
      end
    end
  end

  describe '#post_annotations' do
    let(:user) { FactoryGirl.create :user }
    let(:comment) { FactoryGirl.create :comment, user: user }
    let(:ev_type) { EventType.find_by_event_type 'annotation' }

    context 'when the comment is a reply' do
      let(:user2) { FactoryGirl.create :admin }
      let(:parent) { FactoryGirl.create :comment, user: user2 }
      before do
        parent.replies << comment

        NotificationWorker.jobs.clear
        Event.stub(:create).and_call_original
        Subscription.stub(:create).and_call_original

        pub_sub.post_annotations comment
      end

      it 'should NOT create additional subscriptions' do
        expect(Subscription).not_to have_received(:create)
      end

      it 'should NOT create additional events' do
        expect(Event).not_to have_received(:create)
      end

      it 'should NOT queue a notification worker' do
        expect(NotificationWorker.jobs.size).to eq(0)
      end
    end

    context 'when the comment is on an annotation' do
      let(:annotation) { FactoryGirl.create :annotation }

      before do
        annotation.comments << comment

        NotificationWorker.jobs.clear
        Event.stub(:create).and_call_original
        Subscription.stub(:create).and_call_original
      end

      context 'when the comment has already been pub-subbed' do
        before do
          pub_sub.post_annotations comment
        end

        it 'should NOT create additional subscriptions' do
          expect(Subscription).not_to have_received(:create)
        end

        it 'should NOT create additional events' do
          expect(Event).not_to have_received(:create)
        end

        it 'should NOT queue a notification worker' do
          expect(NotificationWorker.jobs.size).to eq(0)
        end
      end

      context 'when the comment has not been pub-subbed' do
        before do
          comment.user.subscriptions.delete_all
          Event.where(
            target: comment,
            notifiable: annotation.page,
            event_type: ev_type
          ).delete_all

          pub_sub.post_annotations comment
        end

        it 'should subscribe the comment user to future annotations on that page' do
          expect(Subscription).to have_received(:create).once
          expect(
            Subscription.where(
              user: user,
              notifiable: annotation.page,
              event_type: ev_type
            ).size
          ).to eq(1)
        end

        it 'should fire off an annotation event' do
          expect(Event).to have_received(:create).once
          expect(
            Event.where(
              target: comment,
              notifiable: annotation.page,
              event_type: ev_type
            ).size
          ).to eq(1)
        end

        it 'should queue a notification worker' do
          expect(NotificationWorker.jobs.size).to eq(1)
        end
      end
    end
  end

  describe '#post_at_mentions' do
    let(:user) { FactoryGirl.create :user }
    let(:user2) { FactoryGirl.create :admin }
    let(:user3) { FactoryGirl.create :moderator }
    let(:ev_type) { EventType.find_by_event_type 'at_mention' }
    let(:comment) { FactoryGirl.create :comment, user: user3 }

    context 'when there are no new @-mentions' do
      let(:events) { [] }

      before do
        Notifications::NotifyAtMentions.any_instance.stub(:gogogo).and_return events

        Subscription.stub(:create).and_call_original
        NotificationWorker.jobs.clear

        pub_sub.post_at_mentions comment
      end

      it 'should not create any subscriptions' do
        expect(Subscription).not_to have_received(:create)
      end

      it 'should not fire off any events' do
        expect(NotificationWorker.jobs.size).to eq(0)
      end
    end

    context 'when there are new @-mentions' do
      let(:events) do
        [
          FactoryGirl.create(:event, event_type: ev_type, notifiable: comment, target: user),
          FactoryGirl.create(:event, event_type: ev_type, notifiable: comment, target: user2)
        ]
      end

      before do
        Notifications::NotifyAtMentions.any_instance.stub(:gogogo).and_return events

        Subscription.stub(:create).and_call_original
        NotificationWorker.jobs.clear

        pub_sub.post_at_mentions comment
      end

      it 'should create a subscription for each mention, for the mentioned user' do
        expect(Subscription).to have_received(:create).twice
        events.each do |ev|
          expect(
            Subscription.where(
              user: ev.target,
              notifiable: comment,
              event_type: ev_type
            ).size
          ).to eq(1)
        end
      end

      it 'should queue a notification worker for each new mention' do
        expect(NotificationWorker.jobs.size).to eq(events.length)
      end
    end
  end

  describe '#post_replies' do
    let(:user) { FactoryGirl.create :user }
    let(:comment) { FactoryGirl.create :comment, user: user }
    let(:annotation) { FactoryGirl.create :annotation }

    ### test subscription creation ###

    # A subscription is automatically created when the comment is added to the
    # annotation below
    context 'when the comment is already subscribed to the to replies' do
      before do
        annotation.comments << comment
        comment.reload
        Subscription.stub :create
        pub_sub.post_replies comment
      end

      it 'should not create a new subscription' do
        expect(Subscription).not_to have_received(:create)
      end
    end

    context 'when the comment has not yet been subscribed to replies' do
      before do
        Subscription.stub(:create).and_call_original
        pub_sub.post_replies comment
      end

      it 'should create a new subscription, for a replies' do
        expect(Subscription).to have_received(:create)
        expect(
          Subscription.where(
            user: user,
            notifiable: comment,
            event_type: EventType.find_by_event_type('reply')
          ).size
        ).to eq(1)
      end
    end

    ### test event creation ###
    context 'when the comment is a reply' do
      let(:parent) { FactoryGirl.create :comment, user: user }

      before do
        parent.replies << comment
      end

      # Event should be auto-posted, whent he comment is added above
      context 'when a reply event has already been posted for the comment' do
        before do
          Event.stub(:create).and_call_original
          NotificationWorker.jobs.clear

          pub_sub.post_replies comment
        end

        it 'should not create another reply event' do
          expect(Event).not_to have_received(:create)
        end

        it 'should not queue a notification worker' do
          expect(NotificationWorker.jobs.size).to eq(0)
        end
      end

      context 'when the comment has not yet been subscribed to replies' do
        before do
          comment.subscriptions.delete_all
          Event.where(event_type: EventType.find_by_event_type('reply'), notifiable: parent, target: comment).delete_all

          NotificationWorker.jobs.clear

          Event.stub(:create).and_call_original
          Subscription.stub(:create).and_call_original

          pub_sub.post_replies comment
        end

        it 'should create a new subscription' do
          expect(Subscription).to have_received(:create)
          expect(
            Subscription.where(
              user: user,
              notifiable: comment,
              event_type: EventType.find_by_event_type('reply')
            ).size
          ).to eq(1)
        end

        it 'should post an event' do
          expect(Event).to have_received(:create)
          expect(
            Event.where(
              event_type: EventType.find_by_event_type('reply'),
              notifiable: parent,
              target: comment
            ).size
          ).to eq(1)
        end

        it 'should queue a notification worker' do
          expect(NotificationWorker.jobs.size).to eq(1)
        end
      end
    end

    context 'when the comment is not a reply' do
      before do
        Event.stub(:create).and_call_original
      end

      it 'should not fire off a reply event' do
        expect(Event).not_to have_received(:create)
      end

      it 'should not queue a notification worker' do
        expect(NotificationWorker.jobs.size).to eq(0)
      end
    end
  end

  describe '#create_event' do
    let(:ev_type) { EventType.first }
    let(:user) { FactoryGirl.create :user }
    let(:notifiable) { FactoryGirl.create :comment, user: user }
    let(:comment) { FactoryGirl.create :comment, user: user }

    context 'when a duplicate event exists' do
      before do
        Event.create event_type: ev_type,
                     notifiable: notifiable,
                     target: comment
        Event.stub :create

        pub_sub.send :create_event, ev_type.event_type, notifiable, comment
      end

      it 'should not create another event' do
        expect(Event).not_to have_received :create
      end
    end

    context 'when a duplicate event does NOT exist' do
      before do
        Event.stub(:create).and_call_original
        pub_sub.send :create_event, ev_type.event_type, notifiable, comment
      end

      it 'should create and event with the expected attributes' do
        expect(Event).to have_received(:create)
        expect(Event.where(event_type: ev_type, notifiable: notifiable, target: comment).size).to eq(1)
      end
    end
  end

  describe '#post_reply_event' do
    let(:comment) { FactoryGirl.create :comment }

    context 'when the given comment is a reply' do
      let(:user2) { FactoryGirl.create :admin }
      let(:parent) { FactoryGirl.create :comment, user: user2 }
      before do
        parent.replies << comment
        comment.reload
      end

      it 'should queue a notification worker' do
        expect(NotificationWorker.jobs.size).to eq(1)
      end
    end

    context 'when the given comment is NOT a reply' do
      before { pub_sub.send :post_reply_event, comment }

      it 'should not queue a notification worker' do
        expect(NotificationWorker.jobs.size).to eq(0)
      end
    end
  end

  describe '#subscribe_to_mentions' do
    let(:user) { FactoryGirl.create :user }
    let(:user2) { FactoryGirl.create :admin }
    let(:comment) { FactoryGirl.create :comment, user: user }
    let(:comment2) { FactoryGirl.create :comment, user: user }
    let(:ev_type) { EventType.find_by_event_type 'at_mention' }
    let(:events) do
      [
        Event.new(target: user, notifiable: comment, event_type: ev_type),
        Event.new(target: user2, notifiable: comment2, event_type: ev_type)
      ]
    end

    before do
      pub_sub.send :subscribe_to_mentions, events
    end

    it 'should create a subscription for each given event' do
      events.each do |ev|
        expect(
          Subscription.where(user: ev.target, notifiable: ev.notifiable, event_type: ev.event_type).size
        ).to eq(1)
      end
    end
  end

  describe '#subscribe_to_replies' do
    let(:user) { FactoryGirl.create :user }
    let(:annotation) { FactoryGirl.create :annotation }
    let(:comment) { FactoryGirl.create :comment, user: user }
    let(:ev_type) { EventType.find_by_event_type 'reply' }

    before do
      annotation.comments << comment
      comment.reload
    end

    context 'when the comment is already subscribed to replies' do
      before do
        Subscription.stub :create
        pub_sub.send :subscribe_to_replies, comment
      end

      it 'should not create a new subscription' do
        expect(Subscription).not_to have_received(:create)
      end
    end

    context 'when the comment is not subscribed to replies' do
      before do
        # need to remove the subscription, due to the auto-add, when the comment is associated with the annotation
        comment.subscriptions.where(user: user, event_type: ev_type).delete_all
        pub_sub.send :subscribe_to_replies, comment
      end

      it 'should subscribe the posting user to replies' do
        expect(comment.subscriptions.where(user: user, event_type: ev_type).size).to eq(1)
      end
    end
  end

  describe '#subscribe_to_annotations' do
    let(:user) { FactoryGirl.create :user }
    let(:annotation) { FactoryGirl.create :annotation }
    let(:comment) { FactoryGirl.create :comment, user: user }
    let(:ev_type) { EventType.find_by_event_type 'annotation' }

    context 'when the comment is the direct child of an annotation' do
      before do
        annotation.comments << comment
        comment.reload
      end

      # A subscription is automatically created when the comment is added to the annotation above
      context 'and the comment user is already subscribed to this type of event, on the page' do
        before do
          Subscription.stub :create
          pub_sub.send :subscribe_to_annotations, comment
        end

        it 'should not create another subscription' do
          expect(Subscription).not_to have_received(:create)
        end
      end

      context 'and the comment user is NOT already subscribed to this type of event, on the page' do
        before do
          # need to remove the subscription, due to the auto-add, when the comment is associated with the annotation
          user.subscriptions.where(notifiable: annotation.page, event_type: ev_type).delete_all
          pub_sub.send :subscribe_to_annotations, comment
        end

        it 'should create a subscription between the user, page, and of the appropriate event type' do
          expect(user.subscriptions.where(notifiable: annotation.page, event_type: ev_type).size).to eq(1)
        end
      end
    end

    context 'when the comment is a reply' do

      it 'should not create a subscription' do
        expect(user.subscriptions.size).to eq(0)
      end
    end
  end

  describe '#trigger_notifications' do
    let(:events) { [OpenStruct.new(id: 1), OpenStruct.new(id: 2)] }

    before do
      pub_sub.send :trigger_notifications, events
    end

    it 'should queue a notification worker for each event' do
      expect(NotificationWorker.jobs.size).to eq(events.length)
      NotificationWorker.jobs.clear
    end
  end
end

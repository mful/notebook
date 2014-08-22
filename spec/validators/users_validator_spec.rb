require 'fast_helper'
require 'ostruct'
require 'pry'
require './app/validators/users_validator'

describe UsersValidator do
  let(:user) do
    OpenStruct.new(
        email: 'hagrid@hogwarts.com',
        username: 'h',
        password: 'Wing4rdiumLev!osa',
        password_confirmation: 'Wing4rdiumLev!osa',
        errors:  {}
    )
  end
  before do
    user.errors.stub(:add) { |key, msg| user.errors[key.to_sym] = msg }
    stub_const('User', Object.new)
    User.stub(:where) { Array.new }
  end

  describe '.validate' do
    context 'with all required fields' do
      it 'should not add any errors' do
        UsersValidator.validate(user)
        expect(user.errors.length).to eq(0)
      end
    end

    context 'with a bad submission' do
      before do
        @bad_user = user.clone
        @bad_user.stub(:new_record?).and_return(true)
      end

      it 'should err with an invalid email' do
        @bad_user.email = 'ha ha@gmail.com'
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:email)
      end

      it 'should err without an email' do
        @bad_user.email = nil
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:email)
      end

      it 'should err with an empty string email' do
        @bad_user.email = ' '
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:email)
      end

      it 'should err with a too short password' do
        @bad_user.password = 'T3s!t'
        @bad_user.password_confirmation = 'T3s!t'
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:password)
      end

      it 'should err with a too long password' do
        @bad_user.password = 'a' * 51
        @bad_user.password_confirmation = 'a' * 51
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:password)
      end

      it 'should err with an empty string password of sufficient length' do
        @bad_user.password = '              '
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:password)
      end

      context 'with an already in-use username' do
        let(:current_user) { OpenStruct.new(username: @bad_user.username, id: 1) }
        before do
          User.stub(:where).and_return([current_user])
          UsersValidator.any_instance.stub(:validate_email).and_return(nil)
        end

        it 'should err' do
          UsersValidator.validate(@bad_user)
          expect(@bad_user.errors.keys.length).to eq(1)
          expect(@bad_user.errors.keys.first).to eq(:username)
        end
      end

      it 'should err with a too long username' do
        @bad_user.username = 'a' * 21
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:username)
      end

      it 'should err with a username containing invalid characters' do
        @bad_user.username = '%h'
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:username)
      end

      context 'without a password' do
        it 'should err with email/password submission' do
          @bad_user.password = nil
          UsersValidator.validate(@bad_user)
          expect(@bad_user.errors.keys.length).to eq(1)
          expect(@bad_user.errors.keys.first).to eq(:password)
        end

        it 'should pass with a valid email and omniauth source' do
          # stub
        end
      end
      

      it 'should err without a password_confirmation' do
        @bad_user.password_confirmation = nil
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:password)
      end

      it 'should err when the password and password_confirmation do not match' do
        @bad_user.password_confirmation = 'Wing4rdiumLev!os'
        UsersValidator.validate(@bad_user)
        expect(@bad_user.errors.keys.length).to eq(1)
        expect(@bad_user.errors.keys.first).to eq(:password)
      end
    end
  end
end

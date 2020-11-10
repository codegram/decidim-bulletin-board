# frozen_string_literal: true

module Mutations
  class KeyCeremonyMutation < GraphQL::Schema::Mutation
    argument :signed_data, String, required: true

    field :pending_message, Types::PendingMessageType, null: true
    field :error, String, null: true

    def resolve(signed_data:)
      return { error: "Trustee not found" } unless trustee

      EnqueueMessage.call(trustee, signed_data, KeyCeremonyJob) do
        on(:ok) do |pending_message|
          return { pending_message: pending_message }
        end
        on(:invalid) do
          return { error: "There was an error adding the message to the pending list." }
        end
      end
    end

    def trustee
      @trustee ||= Trustee.find_by(unique_id: context[:token])
    end
  end
end
# frozen_string_literal: true

module Decidim
  module BulletinBoard
    module Authority
      # This command uses the GraphQL client to request the starting of the key ceremony.
      class StartKeyCeremony < Decidim::BulletinBoard::Command
        # Public: Initializes the command.
        #
        # election_id - The local election identifier
        def initialize(election_id)
          @election_id = election_id
        end

        # Returns the message_id related to the operation
        def message_id
          @message_id ||= build_message_id(unique_election_id(election_id), "start_key_ceremony")
        end

        # Executes the command. Broadcasts these events:
        #
        # - :ok when everything is valid and the query operation is successful.
        # - :error if query operation was not successful.
        #
        # Returns nothing.
        def call
          # arguments used inside the graphql operation
          args = {
            message_id: message_id,
            signed_data: sign_message(message_id, {})
          }

          response = client.query do
            mutation do
              startKeyCeremony(messageId: args[:message_id], signedData: args[:signed_data]) do
                pendingMessage do
                  status
                end
                error
              end
            end
          end

          return broadcast(:error, response.data.start_key_ceremony.error) if response.data.start_key_ceremony.error.present?

          broadcast(:ok, response.data.start_key_ceremony.pending_message)
        rescue Graphlient::Errors::FaradayServerError
          broadcast(:error, "Sorry, something went wrong")
        end

        private

        attr_reader :election_id
      end
    end
  end
end

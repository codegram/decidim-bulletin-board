# frozen_string_literal: true

module Decidim
  module BulletinBoard
    module Authority
      # This command uses the GraphQL client to request the ending of the voting period.
      class EndVote < Decidim::BulletinBoard::Command
        # Public: Initializes the command.
        #
        # election_id - The local election identifier
        def initialize(election_id)
          @election_id = election_id
        end

        # Executes the command. Broadcasts these events:
        #
        # - :ok when everything is valid and the query operation is successful.
        # - :error if query operation was not successful.
        #
        # Returns nothing.
        def call
          message_id = message_id(unique_election_id(election_id), "end_vote")
          signed_data = sign_message(message_id, {})

          begin
            response = client.query do
              mutation do
                endVote(messageId: message_id, signedData: signed_data) do
                  pendingMessage do
                    status
                  end
                  error
                end
              end
            end
          end

          return broadcast(:error, response.data.end_vote.error) if response.data.end_vote.error.present?

          broadcast(:ok, response.data.end_vote.pending_message)
        rescue Graphlient::Errors::FaradayServerError
          broadcast(:error, "Sorry, something went wrong")
        end

        private

        attr_reader :election_id
      end
    end
  end
end
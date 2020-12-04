# frozen_string_literal: true

# A command with all the business logic to perform a step of the key ceremony
class ProcessKeyCeremonyStep < Rectify::Command
  include LogEntryCommand

  # Public: Initializes the command.
  #
  # trustee - The trustee sender of the key ceremony message
  # message_id - The message identifier
  # signed_data - The signed message received
  def initialize(trustee, message_id, signed_data)
    @client = @trustee = trustee
    @message_id = message_id
    @signed_data = signed_data
  end

  # Executes the command. Broadcasts these events:
  #
  # - :election with the election model referred by the message
  # - :processed when everything is valid.
  # - :invalid if the received data wasn't valid.
  #
  # Returns nothing.
  def call
    build_log_entry

    return broadcast(:invalid, error) unless
      valid_log_entry?("key_ceremony")

    election.with_lock do
      broadcast(:election, election)

      return broadcast(:invalid, error) unless
        valid_step?(election.key_ceremony?) &&
        process_message

      election.log_entries << log_entry
      log_entry.save!
      create_response_log_entry!
      election.save!
    end

    broadcast(:processed)
  end

  private

  attr_accessor :trustee

  def create_response_log_entry!
    return unless response_message

    LogEntry.create!(
      election: election,
      message_id: response_message["message_id"],
      signed_data: BulletinBoard.sign(response_message),
      bulletin_board: true
    )
  end

  def election
    @election ||= Election.find_by(unique_id: message_identifier.election_id)
  end
end
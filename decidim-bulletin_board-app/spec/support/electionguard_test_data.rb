# frozen_string_literal: true

require "jsonl"
require "byebug"

class ElectionguardTestData
  class Messages
    include Enumerable

    def initialize(enumerable)
      @enumerable = enumerable
    end

    def each(&block)
      @enumerable.each(&block)
    end

    def of_type(type)
      Messages.new(filter { |m| m["message_type"] == type })
    end

    def by(wrapper)
      Messages.new(filter { |m| m["wrapper"] == wrapper })
    end

    def inputs
      map { |m| m["in"] }
    end

    def outputs
      map { |m| m["out"] }
    end

    def contents
      inputs.map { |m| m["content"] && JSON.parse(m["content"]) }
    end
  end

  FILE = File.join(File.dirname(__FILE__), "electionguard_test_data.jsonl")
  @messages = JSONL.parse(File.read(FILE))

  def self.messages
    Messages.new(@messages)
  end

  def self.election_steps
    messages.map { |x| x["message_type"].to_sym }.uniq
  end

  def self.election_title
    messages.of_type("create_election").inputs.first
            .dig("description", "name", "text", 0, "value")
  end

  def self.create_election_message
    messages.of_type("create_election").inputs.first
  end

  def self.trustee_ids
    messages.by("Trustee").of_type("key_ceremony.trustee_election_keys").contents.map { |x| x["owner_id"] }.uniq.sort
  end

  def self.trustee_election_keys
    messages.by("Trustee").of_type("key_ceremony.trustee_election_keys").inputs.group_by { |x| JSON.parse(x["content"])["owner_id"] }.map { |_k, v| v[0] }.sort_by { |x| JSON.parse(x["content"])["owner_id"] }
  end

  def self.trustee_partial_election_keys
    messages.by("Trustee").of_type("key_ceremony.trustee_partial_election_keys").inputs.group_by { |x| JSON.parse(x["content"])["guardian_id"] }.map { |_k, v| v[0] }.sort_by { |x| JSON.parse(x["content"])["guardian_id"] }
  end

  def self.trustee_verifications
    messages.by("Trustee").of_type("key_ceremony.trustee_verification").inputs.group_by { |x| JSON.parse(x["content"])["guardian_id"] }.map { |_k, v| v[0] }.sort_by { |x| JSON.parse(x["content"])["guardian_id"] }
  end

  def self.end_key_ceremony
    messages.by("BulletinBoard").of_type("key_ceremony.trustee_verification").outputs.last
  end
end

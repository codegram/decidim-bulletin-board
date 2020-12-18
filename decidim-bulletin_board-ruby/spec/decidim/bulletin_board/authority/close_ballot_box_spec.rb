# frozen_string_literal: true

require "spec_helper"

module Decidim
  module BulletinBoard
    module Authority
      describe CloseBallotBox do
        subject { described_class.new(election_id) }

        include_context "with a configured bulletin board"

        let(:election_id) { "decidim-test-authority.1" }

        let(:bulletin_board_response) do
          {
            closeBallotBox: {
              election: {
                status: "tally"
              }
            }
          }
        end

        context "when everything is ok" do
          it "broadcasts ok with the result of the graphql mutation" do
            expect { subject.call }.to broadcast(:ok)
          end

          it "uses the graphql client to close the ballot box and return its result" do
            subject.on(:ok) do |election|
              expect(election.status).to eq("tally")
            end
            subject.call
          end
        end

        context "when the graphql operation returns an unexpected error" do
          let(:error_response) { true }

          it "broadcasts error with the unexpected error" do
            expect { subject.call }.to broadcast(:error, "Sorry, something went wrong")
          end
        end
      end
    end
  end
end

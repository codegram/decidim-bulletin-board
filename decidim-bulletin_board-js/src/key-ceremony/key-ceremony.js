import { Subject } from "rxjs";
import { Trustee } from "../trustee/trustee";
import { MessageIdentifier, TRUSTEE_TYPE } from "../client/message-identifier";

export const WAIT_TIME_MS = 1_000; // 1s
export const MESSAGE_RECEIVED = "[Message] Received";
export const MESSAGE_PROCESSED = "[Message] Processed";

/**
 * Handles all the key ceremony steps for a specific election and trustee.
 */
export class KeyCeremony {
  /**
   * Initializes the class with the given params.
   *
   * @constructor
   * @param {Object} params - An object that contains the initialization params.
   *  - {Client} bulletinBoardClient - An instance of the Bulletin Board Client
   *  - {Object} electionContext - An object that contains some necessary attributes
   *                               of the election to perform the key ceremony.
   *  - {Object?} options - An optional object with some options to configure the key ceremony.
   */
  constructor({ bulletinBoardClient, electionContext, options }) {
    this.bulletinBoardClient = bulletinBoardClient;
    this.electionContext = electionContext;
    this.currentTrustee = null;
    this.options = options || { bulletinBoardWaitTime: WAIT_TIME_MS };
    this.events = new Subject();
    this.response = null;
    this.trusteeSentMessageIds = [];
  }

  /**
   * Performs some operations to setup the key ceremony. Initializes the trustee
   * object based on the given election context and subscribe to log entries updates.
   *
   * @returns {Promise<void>}
   */
  async setup() {
    const {
      id: electionUniqueId,
      currentTrusteeContext,
    } = this.electionContext;

    this.currentTrustee = new Trustee(currentTrusteeContext);

    this.electionLogEntries = await this.bulletinBoardClient.getElectionLogEntries(
      {
        electionUniqueId,
      }
    );

    this.nextLogEntryIndexToProcess = 0;

    this.subscription = this.bulletinBoardClient.subscribeToElectionLogEntriesUpdates(
      {
        electionUniqueId,
      },
      (logEntry) => {
        this.electionLogEntries = [...this.electionLogEntries, logEntry];
      }
    );

    this.fillTrusteeSentMessageIds();
  }

  /**
   * Collects all the message_ids for the messages already sent by the current trustee.
   */
  fillTrusteeSentMessageIds() {
    this.electionLogEntries.forEach((message) => {
      const messageIdentifier = MessageIdentifier.parse(message.messageId);
      if (
        messageIdentifier.author.type === TRUSTEE_TYPE &&
        messageIdentifier.author.id === this.currentTrustee.id
      ) {
        this.trusteeSentMessageIds.push(message.messageId);
      }
    });
  }

  /**
   * Checks if a restore state operation is needed before starting processing new messages.
   *
   * @returns {Promise<void>}
   */
  restoreNeeded() {
    const lastMessage = this.lastMessageIdSent();
    return lastMessage && this.currentTrustee.checkRestoreNeeded(lastMessage);
  }

  /**
   * Get the last message_id sent to the election log by this trustee.
   *
   * @returns {string}
   */
  lastMessageIdSent() {
    return this.trusteeSentMessageIds[this.trusteeSentMessageIds.length - 1];
  }

  /**
   * Returns the state of the wrapper to be able to perform future restores.
   *
   * @returns {string}
   */
  backup() {
    return this.currentTrustee.backup();
  }

  /**
   * Restores the state of the wrapper to continue from a state backup.
   *
   * @param {string} wrapperState - As string with the wrapper state retrieved from the backup method.
   * @returns {boolean}
   */
  restore(wrapperState) {
    if (!this.restoreNeeded()) {
      return false;
    }

    const lastMessageId = this.lastMessageIdSent();
    return this.currentTrustee.restore(wrapperState, lastMessageId);
  }

  /**
   * Starts or continues with the key ceremony.
   *
   * @param {string} wrapperState - As string with the wrapper state retrieved from the backup method.
   * @returns {Promise<Object>}
   */
  async run() {
    if (this.restoreNeeded()) {
      throw new Error("You need to restore the wrapper state to continue");
    }

    if (this.response) {
      await this.sendMessageToBulletinBoard(this.response);
    }

    return this.waitForNextLogEntryResult().then(
      async ({ message, done, save }) => {
        this.response = message;
        if (!done && !save) {
          return this.run();
        }
      }
    );
  }

  /**
   * Creates a interval that will check periodically if there are new log entries
   * to process. The interval is done when a new log entry is processed and it has
   * a result.
   *
   * @private
   * @returns {Promise<Object>}
   */
  waitForNextLogEntryResult() {
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        let result;

        if (this.electionLogEntries.length > this.nextLogEntryIndexToProcess) {
          result = await this.processNextLogEntry();
        }

        if (result) {
          clearInterval(intervalId);
          resolve(result);
        }
      }, this.options.bulletinBoardWaitTime);
    });
  }

  /**
   * Uses the `Trustee` object to process the next log entry and outputs the result.
   *
   * @private
   * @returns {Promise<Object|null>}
   */
  async processNextLogEntry() {
    const message = this.electionLogEntries[this.nextLogEntryIndexToProcess];

    this.events.next({
      type: MESSAGE_RECEIVED,
      message,
    });

    const result = await this.currentTrustee.processLogEntry(message);

    this.events.next({
      type: MESSAGE_PROCESSED,
      message,
      result,
    });

    this.nextLogEntryIndexToProcess += 1;

    return result;
  }

  /**
   * Sign a message using the `Trustee` identification keys and send it to the Bulletin Board.
   *
   * @private
   * @param {Object} message - An object containing some data to be sent to the Bulletin Board.
   * @returns {Promise<Object>}
   * @throws An exception is raised if there is a problem with the client.
   */
  async sendMessageToBulletinBoard(message) {
    if (this.preventDuplicatedMessages(message)) {
      return;
    }

    const signedData = await this.currentTrustee.sign({
      iat: (new Date() / 1000) | 0,
      ...message,
    });

    return this.bulletinBoardClient.processKeyCeremonyStep({
      messageId: message.message_id,
      signedData,
    });
  }

  /**
   * Checks if the message was already sent to the Bulletin Board, and registers it for the next check.
   *
   * @private
   * @param {Object} message - An object containing some data to be sent to the Bulletin Board.
   * @returns {boolean}
   */
  preventDuplicatedMessages(message) {
    if (this.trusteeSentMessageIds.includes(message.message_id)) {
      return true;
    } else {
      this.trusteeSentMessageIds.push(message.message_id);
      return false;
    }
  }
}

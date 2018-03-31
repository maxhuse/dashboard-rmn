/* eslint-disable class-methods-use-this, no-unused-vars */
const logger = require('../../logger');

class PollingInterface {
  constructor() {
    // We prohibit the creation of an instance of a class PollingInterface.
    // We only allow it to inherit.
    if (new.target === PollingInterface) {
      throw new Error(`It is prohibit to create an instance of ${new.target.name}`);
    }

    this.done = false;

    this.purgeData();
  }

  /**
   * A unique identifier is the name of the event sent to the client
   * @returns {string}
   */
  get id() {
    throw new Error('Not overridden method id()');
  }

  /**
   * Time in milliseconds through which a new request will be sent
   * @returns {number}
   */
  get interval() {
    throw new Error('Not overridden method interval()');
  }

  /**
   * If the polling is done.
   * If it returns true, you no longer need to query the data.
   * If the method returns false,
   * then the polling will end only when no clients are connected to the web sockets.
   * @returns {boolean}
   */
  get isDone() {
    return this.done;
  }

  /**
   * Returns an Promise that must return a new bunch of data.
   * Data must be returned as an object: {event: 'event:name', payload: {...}}
   * or and array of such object. Then each element of the array will be sent separatly/
   * @returns {Promise}
   */
  next() {
    throw new Error('Not overridden method next()');
  }

  /**
   * Set input data
   * @param newData
   */
  setData(newData) {

  }

  /**
   * Removes all auxiliary data
   */
  purgeData() {
    this.data = {};
  }

  /**
   * Handle error from promise, returning by "next" method
   * @param error
   */
  errorHandler(error) {
    logger.log('warn', error);
  }
}

module.exports = PollingInterface;

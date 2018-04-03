const WebSocket = require('ws');
const logger = require('../logger');
const PollingInterface = require('./polling/polling-interface');
const Today = require('./polling/today');
const constants = require('../../shared/constants');

// List of pollings
const POLLING_TASKS = {
  'start:today': Today,
};

class Socket {
  constructor({ port }) {
    this.port = port;
    // List of timers
    this.pollingTimers = new Map();
    // A timer that checks the connection with clients
    this.aliveTimer = null;
  }

  /**
   * Start a websocket server
   */
  connection() {
    // Create a websocket server
    this.websocketServer = new WebSocket.Server({ port: this.port, path: '/websocket' });

    this.websocketServer.on('connection', this.onConnection.bind(this));
  }

  /**
   * Called when a connection is established
   * @param ws
   */
  onConnection(ws) {
    ws.isAlive = true;
    // At the response of the client we are convinced that he is alive
    ws.on('pong', () => { ws.isAlive = true; });
    // When closing the connection, we check whether it is necessary to stop polling
    ws.on('close', this.clearPolling.bind(this));
    // Listen to messages from the client
    ws.on('message', this.onMessage.bind(this));

    this.checkConnectionIsAlive();

    this.initPolling();
  }

  /**
   * Send data to all clients
   * @param data must be object: { event: 'event:name', payload: {...} }
   */
  broadcast(data) {
    // If there is no data, don't do anything
    if (data === undefined || data.event === undefined) {
      return;
    }

    this.websocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  /**
   * Check that connection is alive
   */
  checkConnectionIsAlive() {
    // Do not allow duplicate timer
    if (this.aliveTimer !== null) {
      return;
    }

    // Ask customers once every 30sec by requesting ping.
    // In response, the customer must send pong.
    // Otherwise, the connection will be closed on the next test.
    this.aliveTimer = setInterval(() => {
      this.websocketServer.clients.forEach((ws) => {
        // We break the connection if the customer has not responded
        if (ws.isAlive === false) {
          return ws.terminate();
        }

        // We assume that the client is dead and send a ping request.
        // If the client does not reply in 30sec, then the connection with it will be broken.
        ws.isAlive = false;
        ws.ping('', false, true);
      });
    }, 30000);
  }

  /**
   * Start polling
   */
  initPolling() {
    this.addPolling(new Today());
  }

  /**
   * Start new polling, and add its to list of polling
   * @param handlerClass {PollingInterface}
   */
  addPolling(handlerClass) {
    if (!this.pollingTimers.has(handlerClass.id)) {
      this.startPollingIteration(handlerClass);
    }
  }

  /**
   * Stop and remove polling from the list
   * @param handlerClass {PollingInterface}
   */
  removePolling(handlerClass) {
    const { id } = handlerClass;

    if (this.pollingTimers.has(id)) {
      handlerClass.purgeData();
      clearTimeout(this.pollingTimers.get(id));
      this.pollingTimers.delete(id);
    }
  }

  /**
   * Starts a new polling.
   * If the polling with the same id exists, restart it and register it in the list of pollings.
   * @param handlerClass {PollingInterface}
   */
  startPollingIteration(handlerClass) {
    // Stop previous polling with the same id
    if (this.pollingTimers.has(handlerClass.id)) {
      clearTimeout(this.pollingTimers.get(handlerClass.id));
    }

    // Save polling id in the list of pollings
    this.pollingTimers.set(
      handlerClass.id,
      setTimeout(
        this.performPollingCallback.bind(this, handlerClass),
        handlerClass.interval,
      )
    );
  }

  /**
   * Starts a new polling and restarts it after resolving or rejecting the request.
   * @param handlerClass {PollingInterface}
   */
  performPollingCallback(handlerClass) {
    handlerClass.next().then(
      data => this.onRequestEnd(data, handlerClass),
      data => this.onRequestEnd(data, handlerClass),
    );
  }

  /**
   * After the polling is complete,
   * it sends the received data to the websocket and starts a new request.
   * @param {object|array} data
   * @param handlerClass
   */
  onRequestEnd(data, handlerClass) {
    // If data contains a list of responses, then we send each one separately
    if (Array.isArray(data)) {
      data.forEach((item) => {
        this.broadcast(item);
      });
    } else {
      this.broadcast(data);
    }

    if (handlerClass.isDone) {
      // Remove the polling when it finishes its work
      this.removePolling(handlerClass);
    } else {
      // Sending response for a new piece of data
      this.startPollingIteration(handlerClass);
    }
  }

  /**
   * Stop polling if there are no connections
   * @returns {boolean}
   */
  clearPolling() {
    // If there are no connections
    if (this.websocketServer.clients.size === 0) {
      // Stop all timers
      this.pollingTimers.forEach((timer) => {
        clearTimeout(timer);
      });
      // Clear the list, so that you can re-add the timer
      this.pollingTimers.clear();
      // If there are no clients, then you do not need to check the connection with them anymore.
      clearInterval(this.aliveTimer);
      this.aliveTimer = null;
    }
  }

  /**
   * Start polling tasks
   * @param req
   */
  addPollingTask(req) {
    // If there is an appropriate task
    if (POLLING_TASKS[req.event] !== undefined) {
      // Create its exemplar
      const task = new POLLING_TASKS[req.event]();

      if (!(task instanceof PollingInterface)) {
        return;
      }

      // Set input data
      if (req.payload) {
        task.setData(req.payload);
      }

      // Start polling
      this.addPolling(task);
    }
  }

  /**
   * Listen messages from client
   * @param req
   */
  onMessage(req) {
    try {
      req = JSON.parse(req);
      // Start new polling, if this type exists in the list POLLING_TASKS
      this.addPollingTask(req);
    } catch (error) {
      logger.log('warn', error);
    }
  }
}

module.exports = new Socket({ port: constants.WEBSOCKET_PORT });

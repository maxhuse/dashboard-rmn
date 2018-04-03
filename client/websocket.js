import { WEBSOCKET_PORT } from 'shared/constants';
import EventAggregator from 'event-aggregator';

class Websocket {
  // Maximum number of attempts to reconnect
  static MAX_CONNECTION_ATTEMPT = 60;
  // The current number of attempts to restore the connection
  connectionAttempt = 0;
  socket = null;
  EA = new EventAggregator();

  open() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

    // Do not produce multiple connections
    if (this.socket !== null &&
      (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    this.socket = new WebSocket(`${protocol}://${location.hostname}:${WEBSOCKET_PORT}/websocket`);

    this.socket.addEventListener('open', (event) => {
      // If successfully connected, reset the failed connection counter
      this.connectionAttempt = 0;
      this.open(event);
    });

    // Handler incoming messages
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data !== undefined && data.event !== undefined) {
        this.EA.trigger(data.event, data.payload);
      }
    });

    this.socket.addEventListener('close', (event) => {
      this.socket = null;

      // If the connection is closed with an error
      // and the number of attempts to restore the connection does not exceed the allowable value
      if (!event.wasClean && this.connectionAttempt < Websocket.MAX_CONNECTION_ATTEMPT) {
        // Trying to reconnect after a break
        setTimeout(() => {
          this.connectionAttempt += 1;
          this.open();
        }, 5000);
      }
    });
  }

  close() {
    if (this.socket !== null) {
      this.socket.close();
    }
  }

  send(data) {
    if (this.socket !== null && data !== undefined && data.event !== undefined) {
      this.socket.send(JSON.stringify(data));
    }
  }

  subscribe(eventName, callback) {
    this.EA.on(eventName, callback);
  }

  unsubscribe(eventName, callback) {
    this.EA.off(eventName, callback);
  }
}

export default new Websocket();

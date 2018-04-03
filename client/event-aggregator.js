class EventAggregator {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }

  off(eventName, callback) {
    const eventsType = this.events[eventName];

    if (eventsType) {
      for (let i = 0; i < eventsType.length; i += 1) {
        if (eventsType[i] === callback) {
          eventsType.splice(i, 1);
          break;
        }
      }
    }
  }

  trigger(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback(data);
      });
    }
  }
}

export default EventAggregator;

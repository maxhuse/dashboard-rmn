import { observable, flow, set, action } from 'mobx';
import ajax from 'ajax';
import websocket from 'websocket';

const URL = '/api/today';

class TodayStore {
  @observable data = {
    newOrders: null,
    closedOrders: null,
    revenue: null,
    visits: null,
  };
  isSubscribedOnUpdate = false;

  fetch = flow(function* fetch() {
    const response = yield ajax.get(URL);

    if (response.isSuccess) {
      set(this.data, response.data);
    }

    return response;
  });

  @action.bound
  update(data) {
    set(this.data, data);
  }

  subscribeOnUpdate() {
    // Subscribe on update if we have not subscribed yet
    if (this.isSubscribedOnUpdate !== true) {
      this.isSubscribedOnUpdate = true;
      websocket.subscribe('update:today', this.update);
    }
  }

  unsubscribeOnUpdate() {
    websocket.unsubscribe('update:today', this.update);
    this.isSubscribedOnUpdate = false;
  }
}

export default new TodayStore();

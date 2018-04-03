import { observable, flow, action } from 'mobx';
import ajax from 'ajax';
import websocket from '../../websocket';

const URL = '/api/orders';

class OrdersStore {
  @observable data = [];
  isSubscribedOnAdd = false;

  fetch = flow(function* fetch() {
    const response = yield ajax.get(URL);

    if (response.isSuccess) {
      this.data.replace(response.data);
    }

    return response;
  });

  @action.bound
  onAddOrder(data) {
    this.data.unshift(data);
    this.data.pop();
  }

  subscribeOnAdd() {
    // Subscribe on add order if we have not subscribed yet
    if (this.isSubscribedOnAdd !== true) {
      this.isSubscribedOnAdd = true;
      websocket.subscribe('add:order', this.onAddOrder);
    }
  }

  unsubscribeOnAdd() {
    websocket.unsubscribe('add:order', this.onAddOrder);
    this.isSubscribedOnAdd = false;
  }
}

export default new OrdersStore();

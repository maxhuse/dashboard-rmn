import { observable, flow } from 'mobx';
import ajax from 'ajax';

const URL = '/api/orders';

export class OrdersStore {
  @observable data = [];

  fetch = flow(function* fetch() {
    const response = yield ajax.get(URL);

    if (response.isSuccess) {
      this.data.replace(response.data);
    }

    return response;
  });
}

export default new OrdersStore();

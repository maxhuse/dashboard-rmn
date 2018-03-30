import { observable, flow, set } from 'mobx';
import ajax from 'ajax';

const URL = '/api/today';

export class TodayStore {
  @observable data = {
    newOrders: null,
    closedOrders: null,
    revenue: null,
    visits: null,
  };

  fetch = flow(function* fetch() {
    const response = yield ajax.get(URL);

    if (response.isSuccess) {
      set(this.data, response.data);
    }

    return response;
  });
}

export default new TodayStore();

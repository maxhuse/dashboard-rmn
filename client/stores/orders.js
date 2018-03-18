import { observable, action, computed } from 'mobx';

export class OrdersStore {
  @observable isLoading = false;

  @action loadArticles() {
    this.isLoading = true;

  }
}

export default new OrdersStore();

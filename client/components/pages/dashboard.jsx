import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import dataFetcher from 'components/data-fetcher-enhance';

@inject('ordersStore')
@dataFetcher('ordersStore')
@observer
export default class Dashboard extends Component {
  render() {
    return (
      <Fragment>
        {this.props.ordersStore.data.map(order => <div key={order.id}>{order.id}, {order.date}</div>)}
      </Fragment>
    );
  }
}

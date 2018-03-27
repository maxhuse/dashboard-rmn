import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import i18next from 'i18next';
import dataFetcher from 'components/data-fetcher-enhance';
import Card from 'components/card';
import { Table } from 'components/table';
import { getFormatDateTime } from 'helpers';

@inject('ordersStore')
@dataFetcher('ordersStore')
@observer
export default class Dashboard extends Component {
  render() {
    const { ordersStore } = this.props;

    const orderCells = [
      {
        id: 'order',
        name: i18next.t('order'),
        className: 'table_orders__cell_order',
        getValue: item => item.product.name,
      },
      {
        id: 'date',
        name: i18next.t('date'),
        className: 'table_orders__cell_date',
        getValue: item => getFormatDateTime(item.date),
      },
      {
        id: 'price',
        name: i18next.t('price'),
        className: 'table_orders__cell_price',
        getValue: item => item.value,
      },
    ];

    return (
      <div className="dashboard">
        <div className="dashboard__row">
          <div className="dashboard__row-item dashboard__row-item_orders">
            <Card headerText={i18next.t('last_orders')}>
              <Table
                cells={orderCells}
                items={ordersStore.data}
              />
            </Card>
          </div>

          <div className="dashboard__row-item dashboard__row-item_today">
            <Card headerText={i18next.t('today')}>
              woof
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

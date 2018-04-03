import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, extendObservable, toJS as mobxToJS, set, reaction } from 'mobx';
import i18next from 'i18next';
import dataFetcher from 'components/data-fetcher-enhance';
import Card from 'components/card';
import { Table } from 'components/table';
import { getFormatDateTime, beautifyCellValue } from 'helpers';

export const TodayTableCell = observer(({ className, getValue }) => {
  const cellValue = beautifyCellValue(getValue());

  return (
    <div className={className} title={typeof cellValue === 'string' ? cellValue : null}>
      <span className="text text_size_36">{cellValue}</span>
    </div>
  );
});

@observer
class TodayCard extends Component {
  constructor(props) {
    super(props);

    // We want to represent the todayStore.data as array for pass to Table.items
    this.todayItems = observable([{ id: 1 }]);

    // Add attributes from todayStore.data
    extendObservable(this.todayItems[0], mobxToJS(props.todayStore.data));

    // When todayStore.data changed, set that data to the first element of todayItems
    this.disposeTodayItemsReaction = reaction(
      () => mobxToJS(props.todayStore.data),
      (data) => {
        set(this.todayItems[0], data);
      }
    );

    // Subscribe the store for changes from the WebSocket
    props.todayStore.subscribeOnUpdate();
  }

  componentWillUnmount() {
    this.disposeTodayItemsReaction();
    this.props.todayStore.unsubscribeOnUpdate();
  }

  render() {
    const todayCells = [
      {
        id: 'revenue',
        name: i18next.t('revenue'),
        className: 'table_today__cell_revenue',
        getValue: item => item.revenue,
        component: TodayTableCell,
      },
      {
        id: 'visits',
        name: i18next.t('visits'),
        className: 'table_today__cell_visits',
        getValue: item => item.visits,
        component: TodayTableCell,
      },
      {
        id: 'closed_orders',
        name: i18next.t('closed_orders'),
        className: 'table_today__cell_closed-orders',
        getValue: item => item.closedOrders,
        component: TodayTableCell,
      },
      {
        id: 'new_orders',
        name: i18next.t('new_orders'),
        className: 'table_today__cell_new-orders',
        getValue: item => item.newOrders,
        component: TodayTableCell,
      },
    ];

    return (
      <Card headerText={i18next.t('today')}>
        <Table
          cells={todayCells}
          items={this.todayItems}
        />
      </Card>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
@inject('ordersStore', 'todayStore')
@dataFetcher('ordersStore', 'todayStore')
@observer
export default class Dashboard extends Component {
  render() {
    const { ordersStore, todayStore } = this.props;

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
        getValue: item => getFormatDateTime(item.creationDate),
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
            <TodayCard todayStore={todayStore} />
          </div>
        </div>
      </div>
    );
  }
}

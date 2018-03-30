import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import i18next from 'i18next';
import { TableCell } from './cell';
import { TableRow } from './row';

const EmptyTableContent = () => (
  <div className="empty-table">
    <i className="material-icons empty-table__icon">sentiment_dissatisfied</i>
    <div className="empty-table__title">
      {i18next.t('no_data_here')}
    </div>
  </div>
);

const TableHeader = ({ cells }) => (
  <div className="table__row table__row_header">
    {cells.map(cell => (
      <TableCell
        key={cell.id}
        className={classnames('table__cell', 'table__cell_header', cell.className)}
        value={cell.name}
      />
    ))}
  </div>
);

const TableContent = observer(({ items, cells }) => (
  <Fragment>
    {items.map(item => (
      <TableRow
        key={item.id}
        cells={cells}
        item={item}
      />
    ))}
  </Fragment>
));

@observer
export default class Table extends Component {
  render() {
    const { cells, items } = this.props;

    const hasItems = items.length > 0;

    return (
      <div className="table">
        {hasItems && <TableHeader cells={cells} />}
        {hasItems ?
          <TableContent cells={cells} items={items} /> :
          <EmptyTableContent />
        }
      </div>
    );
  }
}

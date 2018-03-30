import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { TableCell } from './cell';

@observer
export class TableRow extends Component {
  render() {
    const { item, cells } = this.props;

    return (
      <div className="table__row">
        {cells.map((cell) => {
          const CellComponent = cell.component || TableCell;
          const componentProps = cell.componentProps || {};

          return (
            <CellComponent
              key={cell.id + cell.className}
              className={classnames('table__cell', cell.className)}
              getValue={() => cell.getValue(item)}
              {...componentProps}
            />
          );
        })}
      </div>
    );
  }
}

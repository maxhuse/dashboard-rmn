import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { TableCell } from './cell';

// If value is undefined or empty string, put a dash
const getCellValue = value => (
  value === undefined || value === '' || value === null ?
    '\u2014' :
    value
);

@observer
export class TableRow extends Component {
  render() {
    const { item, cells } = this.props;

    return (
      <div className="table__row">
        {cells.map((cell) => {
          const CellComponent = cell.component || TableCell;
          const componentProps = cell.componentProps || {};
          const value = getCellValue(cell.getValue(item));

          return <CellComponent
            key={cell.id + cell.className}
            className={classnames('table__cell', cell.className)}
            value={value}
            {...componentProps}
          />;
        })}
      </div>
    );
  }
}

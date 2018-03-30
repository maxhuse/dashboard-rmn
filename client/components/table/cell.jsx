import React from 'react';
import { observer } from 'mobx-react';
import { beautifyCellValue } from 'helpers';

export const TableCell = observer(({ className, getValue, value }) => {
  const cellValue = value || beautifyCellValue(getValue());

  return (
    <div className={className} title={typeof cellValue === 'string' ? cellValue : null}>
      {cellValue}
    </div>
  );
});

import React from 'react';
import { observer } from 'mobx-react';

export const TableCell = observer(({ className, value }) => (
  <div className={className} title={typeof value === 'string' ? value : null}>
    {value}
  </div>
));

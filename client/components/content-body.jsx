import React from 'react';

const ContentBody = props => (
  <div className="content">
    <div className="content__body">
      {props.children}
    </div>
  </div>
);

export default ContentBody;

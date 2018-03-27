import React from 'react';
import classnames from 'classnames';

const Card = ({ children, className, headerText }) => {
  const cardClassName = classnames('card', className);

  return (
    <div className={cardClassName}>
      <div className="card__header">{headerText}</div>
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;

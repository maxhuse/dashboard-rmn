import React from 'react';
import i18next from 'i18next';

const Header = () => (
  <header className="header">
    <div className="header__title">{i18next.t('dashboard')}</div>
  </header>
);

export default Header;

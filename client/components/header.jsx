import React from 'react';
import i18next from 'i18next';

export default function Header() {
  return (
    <header className="header">
      <div className="header__title">{i18next.t('dashboard')}</div>
    </header>
  );
}

import React from 'react';
import logo from '../image/Header_Mesto_Logo.svg';
import burger from '../image/burger-icon.svg';
import close from '../image/CloseIcon.svg';
import HeaderBar from './HeaderBar';

export default function Header({ onSignOut, userEmail }) {
  const [ burgerOpen, setBurgerOpen ] = React.useState(false);

  function handleBurgerChange(e) {
    setBurgerOpen(!burgerOpen);
  }

  return (
    <header className="header">
      {burgerOpen && (
        <div className="header__bar-for-small">
          <HeaderBar onSignOut={onSignOut} userEmail={userEmail} />
        </div>
      )}
      <div className="header__wrapper">
        <img className="header__logo" src={logo} alt="Место-логотип" />
        <div className="header__burger">
          {burgerOpen ?
          (
          <img className="header__burger-close" src={close} alt="закрыть" onClick={handleBurgerChange} />
          ) :
          (
          <img className="header__burger-icon" src={burger} alt="бургер" onClick={handleBurgerChange} />
          )}
        </div>
        <div className="header__bar-for-big">
          <HeaderBar onSignOut={onSignOut} userEmail={userEmail} />
        </div>
      </div>
    </header>
  );
}
import logo from '../image/Header_Mesto_Logo.png';

export function Header() {
  return (
    <header className="header">
      <a href="#"><img className="header__logo" src={logo} alt="Логотип Mesto"/></a> {/* <a></a> нужно изменить на <button></button> и убрать стили */}
    </header>
  )}
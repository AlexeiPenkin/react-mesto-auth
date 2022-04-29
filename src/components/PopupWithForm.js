import React from 'react';
// import {Main} from './Main.js';


export function PopupWithForm(props) {
  return (
    <div className={`popup ${props.name} ${props.isOpen ? `popup_opened`: ""}`} onClick={props.onCloseClick}>
      <div className="popup__container">
      <button 
        className="popup__close-button" 
        type="button" 
        title="Закрыть" 
        onClick={props.onClose}>{props.buttonText}
      </button>
        <form className="form" name={props.name} onSubmit={props.onSubmit}>
          <h2 className="form__title">{props.title}</h2>
          <fieldset className="form__set">
            <label className="form__field form__field_type-name">
              {props.children}
              <span className="form__input-error"></span>
            </label>
            <button 
                className="form__submit-button" 
                type="submit" 
                title="Сохранить">{props.buttonText}
              </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
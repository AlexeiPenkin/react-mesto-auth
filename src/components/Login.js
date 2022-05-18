import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Валидация
  const [ inputEmailErrorText, setInputEmailErrorText ] = React.useState('Вы пропустили это поле.');
  const [ inputPasswordErrorText, setInputPasswordErrorText ] = React.useState('Вы пропустили это поле.');

  const [ inputEmailValid, setInputEmailValid ] = React.useState(true);
  const [ inputPasswordValid, setInputPasswordValid ] = React.useState(true);
  const [ formValid, setFormValid ] = React.useState(false);

  const submitButtonClassName = `sign__submit ${formValid ? '' : 'sign__submit_disabled'}`;

  const inputEmailClassName = `sign__input sign__input_type_name ${inputEmailValid ? '' : 'sign__input_type_error'}`;
  const inputEmailErrorClassName = `sign__input-error ${inputEmailValid ? '' : 'sign__input-error_visible'}`;

  const inputPasswordClassName = `sign__input sign__input_type_job ${inputPasswordValid ? '' : 'sign__input_type_error'}`;
  const inputPasswordErrorClassName = `sign__input-error ${inputPasswordValid ? '' : 'sign__input-error_visible'}`;


  function handleEmailChange(e) {
    setEmail(e.target.value);
    
    setInputEmailValid(e.target.validity.valid);
    setInputEmailErrorText(e.target.validationMessage);
    
    if (e.target.validity.valid && inputPasswordValid && password !== '') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }
  
  function handlePasswordChange(e) {
    setPassword(e.target.value);
    
    setInputPasswordValid(e.target.validity.valid);
    setInputPasswordErrorText(e.target.validationMessage);
    
    if (inputEmailValid && e.target.validity.valid && email !== '') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }
  
  useEffect(() => {
    setFormValid(false);
  }, []);
  
  function handleSubmit(e) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <div className="sign">
      <div className="sign__container">
        <form className="sign__form" name="sign__form" onSubmit={handleSubmit} noValidate>
          <h2 className="sign__title">Вход</h2>
          <fieldset className="sign__set">
            <label className="sign__field sign__field_type-email">
              <input
                className={inputEmailClassName}
                type="email"
                name="email"
                placeholder="Email"
                required
                minLength="2"
                maxLength="40"
                value={email}
                onChange={handleEmailChange}
              />
              <span className={inputEmailErrorClassName}>
                {inputEmailErrorText}
              </span>
            </label>
            <label className="sign__field sign__field_type-password">
              <input
                className={inputPasswordClassName}
                type="password"
                name="password"
                placeholder="Пароль"
                required
                minLength="2"
                maxLength="200"
                value={password}
                onChange={handlePasswordChange}
              />
              <span className={inputPasswordErrorClassName}>
                {inputPasswordErrorText}
              </span>
            </label>
            <button className={submitButtonClassName} type="submit" disabled={formValid ? false : true}>
              Войти
            </button>
          </fieldset>
        </form> 
      </div> 
  </div>
  )
}

export default withRouter(Login);
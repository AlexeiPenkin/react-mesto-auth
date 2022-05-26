import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Register(props) {
  const [data, setData] = useState({ 
    email: '', 
    password: '' 
  });
  // const [message, setMessage] = useState('');

  function handleChange(e) {
    const {name, value} = e.target;
    setData((data) => ({
      ...data,
      [name]: value
    }));
  }

  // useEffect(() => {
  //   setFormValid(false);
  // }, []);

  function handleSubmit(evt) {
    evt.preventDefault();
    console.log('data', data)
    const { email, password } = data;
    props.onRegister({ email, password })
      // .catch(err => {
      //   setMessage(err.message);
      // })
  }

  return (
    <div className='register'>
      <div className='register__container'>
        <form className='register__form' name='register__form' onSubmit={handleSubmit} noValidate>
          <h2 className='register__title'>Регистрация</h2>
          <fieldset className='register__set'>
            <label className='register__field register__field_type_email'>
              <input
                className='register__input register__input_type_email'
                type='email'
                name='email'
                placeholder='Email'
                required
                minLength='2'
                maxLength='40'
                value={data.email}
                onChange={handleChange}
              />
              <span className='register__input-error'>Вы пропустили это поле.</span>
            </label>
            <label className='register__field register__field_type_password'>
              <input
                className='register__input register__input_type_password'
                type='password'
                name='password'
                placeholder='Пароль'
                required
                minLength='2'
                maxLength='200'
                value={data.password}
                onChange={handleChange}
              />
              <span className='register__input-error'>Вы пропустили это поле.</span>
            </label>
            <button className='register__submit' type='submit'>
              Зарегистрироваться
            </button>
            <div className="register__signin">
              <p className="register__signin_p">Уже зарегистрированы?</p>
              <Link to="signin" className="register__signin_link">Войти</Link>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Register;
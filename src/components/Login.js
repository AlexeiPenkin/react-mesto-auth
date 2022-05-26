import React, { useState } from 'react';


function Login(props) {
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

  function handleSubmit(e) {
    e.preventDefault();
    console.log('data', data)
    const { email, password } = data;
    props.onLogin({ email, password })
    // .catch(err => {
    //   setMessage(err.message);
    // })
  }

  return (
    <div className='login'>
      <div className='login__container'>
        <form className='login__form' name='login__form' onSubmit={handleSubmit} noValidate>
          <h2 className='login__title'>Вход</h2>
          <fieldset className='login__set'>
            <label className='login__field login__field_type_email'>
              <input
                className='login__input login__input_type_email'
                type='email'
                name='email'
                placeholder='Email'
                required
                minLength='2'
                maxLength='40'
                value={data.email}
                onChange={handleChange}
              />
              <span className='login__input-error'>Вы пропустили это поле.</span>
            </label>
            <label className='login__field login__field_type_password'>
              <input
                className='login__input login__input_type_password'
                type='password'
                name='password'
                placeholder='Пароль'
                required
                minLength='2'
                maxLength='200'
                value={data.password}
                onChange={handleChange}
              />
              <span className='login__input-error'>Вы пропустили это поле.</span>
            </label>
            <button className='login__submit' type='submit'>
              Войти
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Login;
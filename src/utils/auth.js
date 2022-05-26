export const baseUrl = 'https://auth.nomoreparties.co';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return res.json()
      .then((data) => {
        // console.log(data);
        throw new Error(data.message[0].messages[0].message);
      });
};

export const register = (username, password, email) => {
  return fetch(`${baseUrl}/signup`, { // /auth/local/register
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, email })
	})
    .then(checkResponse)
};

export const authorize = (email, password) => {
  return fetch(`${baseUrl}/signin`, { // /auth/local
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(checkResponse)
};

export const getContent = (jwt) => {
  return fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    }
  })
    .then(checkResponse)
};
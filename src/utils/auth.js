// export const baseUrl = 'https://auth.nomoreparties.co';

// export const register = (email, password) => {
//   return fetch(`${baseUrl}/sign-up`, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ email, password })
// 	})
//     .then((res) => 
//       res.json())
//     .then((res) => {
//       return res;
//     }) 
//     .catch((err) => 
//       console.log(err));
// };

// export const authorize = (email, password) => {
//   return fetch(`${baseUrl}/sign-in`, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ email, password })
//   })
//     .then((res) => 
//       res.json());
// };

// export const checkToken = (token) => {
//   return fetch(`${baseUrl}/users/me`, {
//     method: 'GET',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`
//     }
//   })
//     .then((res) => res.json())
//     .then((data) => data);
// };
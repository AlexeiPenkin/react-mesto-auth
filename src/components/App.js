import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import AddPlacePopup from './AddPlacePopup';
import api from '../utils/Api';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import Footer from './Footer';
import Header from './Header';
// import HeaderBar from './HeaderBar';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Main from './Main';
import NotFound from './NotFound';
// import PopupWithForm from './PopupWithForm';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import * as auth from '../utils/auth';


export default function App() {
  const history = useHistory();

  //Заполняем контент--------------------------------------------------------------
  const [ currentUser, setCurrentUser ] = useState({});
  const [ cards, setCards ] = useState([]);
  const [ userData, setUserData ] = useState({ email: 'EMAIL' });
  const [ infoToolTipData, setInfoToolTipData ] = useState({
    title: 'Что-то пошло не так! Попробуйте ещё раз.', icon: false});

  //Переменные статуса --------------------------------------------------------------
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ regStatus, setRegStatus ] = useState(false);

  // Открытие/закрытие попапов --------------------------------------------------------------
  // const [currentUser, setCurrentUser] = React.useState({name: '', about: '', avatar: ''});
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setisDeleteConfirmPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deleteCard, setDeleteCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [ isInfoToolTipOpen, setIsInfoToolTipOpen ] = useState(false);
  // const [ cardToDelete, setCardToDelete ] = useState({});


  useEffect(() => {
    Promise.all([api.getProfile(), api.getCards()])
      .then(([data, cards]) => {
        setCurrentUser(data);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  function handleUpdateUser(data) {
    setIsLoading(true);
    api.editProfile(data)
        .then(res => {
            setCurrentUser(res);
            closeAllPopups()
        })
        .then(() => {
            setEditProfilePopupOpen(false);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        })
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api.updateAvatar(data)
        .then(res => {
          setCurrentUser(res);
          closeAllPopups()
        }) 
        .then(() => {
          setEditAvatarPopupOpen(false);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        })
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api.addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups()
      })
      .then(() => {
        handleAddPlacePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id === card._id ? c.remove : c))
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditProfilePopupOpen() {
    setEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlacePopupOpen() {
    setAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleEditAvatarPopupOpen() {
    setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleCardDeletePopupOpen(card) {
    setisDeleteConfirmPopupOpen(true);
    setDeleteCard(card);
  }

  function handleImagePopupOpen(card) {
    setIsImagePopupOpen(true);
    setDeleteCard(card);
  }

  function handleInfoToolTip() {
    setIsInfoToolTipOpen(true);
  }

  function handleClick(e) {
    if (e.target.classList.contains('popup')) {
      closeAllPopups();
    }
  }

  const  closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setisDeleteConfirmPopupOpen(false);
    setSelectedCard(null);
    // setIsImagePopupOpen(false);
    setIsInfoToolTipOpen(false);
    }

  // Авторизация --------------------------------------------------------------
  function tokenCheck() {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит валидность токена
    const token = localStorage.getItem('token');
    if (token) {
      // проверим токен
      auth.checkToken(token)
        .then((res) => {
          if (res) {
            // получаем данные пользователя
            setUserData({ email: res.data.email });
            setLoggedIn(true);
          }
        })
        .catch((err) => console.error(err));
    }
  }
	//проверяем токен при загрузке App
	useEffect(() => {
		tokenCheck();
	}, []);

  //если залогинились, то сразу грузим данные с переходом на главную
  useEffect(
    () => {
      if (loggedIn) {
        Promise.all([ api.getUser(), api.getInitialCards() ])
          .then(([ userData, cardsData ]) => {
            setCurrentUser(userData);
            setCards(cardsData);
          })
          .catch((err) => {
            console.error(err);
          });
        history.push('/');
      }
    },
    [ history, loggedIn ]
  );

  function handleLogin(email, password) {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setUserData({ email: email });
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch((err) => console.error(err));
  }

  function handleRegister(email, password) {
    auth.register(email, password).then((res) => {
      if (res.data) {
        setRegStatus(true);
        history.push('/');
        setInfoToolTipData({ icon: true, title: 'Вы успешно зарегистрировались!' });
        handleInfoToolTip();
      } else {
        setRegStatus(false);
        handleInfoToolTip();
      }
    });
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUserData({ email: '' });
    setLoggedIn(false);
  }

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
            <Header onSignOut={handleLogout} userEmail={userData.email}/>
              <Switch>
                <ProtectedRoute
                  exact
                  path="/"
                  cards={cards}
                  onEditProfile={handleEditProfilePopupOpen}
                  onAddPlace={handleAddPlacePopupOpen}
                  onEditAvatar={handleEditAvatarPopupOpen}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDeletePopupOpen}
                  component={Main}
                  loggedIn={loggedIn}
                />
                <Route path="/sign-in">
                  <Login onLogin={handleLogin} />
                </Route>
                <Route path="/sign-up">
                  <Register onRegister={handleRegister} regStatus={regStatus} />
                </Route>
                <Route exact path="/">
                  {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
                </Route>
                <Route path="/*">
                  <NotFound />
                </Route>
              </Switch>
            <InfoTooltip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              onEscClose={handleClick}
              title={infoToolTipData.title}
              icon={infoToolTipData.icon}
              onLoading={isLoading}
            />
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                buttonText='Сохранить'
                onUpdateUser={handleUpdateUser}
                onClose={closeAllPopups}
                onLoading={isLoading}
            />
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                buttonText='Создать'
                onAddPlace={handleAddPlaceSubmit}
                onClose={closeAllPopups}
                onLoading={isLoading}
            />
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                buttonText='Сохранить'
                onUpdateAvatar={handleUpdateAvatar}
                onClose={closeAllPopups}
                onLoading={isLoading}
            />
            <DeleteConfirmPopup
                isOpen={isDeleteConfirmPopupOpen}
                buttonText='Да'
                onDeleteConfirm={handleCardDelete}
                onClose={closeAllPopups}
                onLoading={isLoading}
                card={deleteCard}
            />
            <ImagePopup
                isOpen={handleImagePopupOpen}
                card={selectedCard}
                onClose={closeAllPopups}>
            </ImagePopup>
            <Footer/>
        </div>
      </CurrentUserContext.Provider>
  );
}
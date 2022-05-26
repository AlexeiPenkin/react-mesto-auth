import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import AddPlacePopup from './AddPlacePopup';
import api from '../utils/Api';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import Footer from './Footer';
import Header from './Header';
import HeaderBar from './HeaderBar';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Main from './Main';
import NotFound from './NotFound';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Preloader from './Preloader';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import * as auth from '../utils/auth';

function App() {
  const [ currentUser, setCurrentUser ] = useState({});
  const [ cards, setCards ] = useState([]);
  const [ userData, setUserData ] = useState({});
  const [ infoToolTipData, setInfoToolTipData ] = useState({
    title: 'Что-то пошло не так! Попробуйте ещё раз.', icon: false});
  const [ isInfoToolTipOpen, setInfoToolTipOpen ] = useState(false);

  const [ loggedIn, setLoggedIn ] = useState(false);
  // eslint-disable-next-line
  const [ regStatus, setRegStatus ] = useState(false);
  const [resStatus, setResStatus] = useState("");
  const history = useHistory();

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setisDeleteConfirmPopupOpen] = useState(false);
  // eslint-disable-next-line
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deleteCard, setDeleteCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);



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
  // eslint-disable-next-line
  function handleInfoToolTip() {
    setInfoToolTipOpen(true);
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
    setSelectedCard(null); /* ({}) */
    // setIsImagePopupOpen(false);
    setInfoToolTipOpen(false);
    }

  // Авторизация -----------------------------------------------------------

  function handleRegister({ email, password }) {
      return auth.register(email, password)
      .then(res => {
        const { email, password } = res.data;
        setUserData({ ...userData, email, password })
        if (res.data) {
          history.push('/');
          setInfoToolTipData({ icon: true, title: 'Вы успешно зарегистрировались!' });
          handleInfoToolTip();
        }
        history.push("/signin");
      })
      .catch((err) => {
        console.log(`Ошибка...: ${err}`);
        setInfoToolTipData({ icon: false, title: 'Что-то пошло не так! Попробуйте ещё раз.' });
      })
      .finally(() => {
        setInfoToolTipOpen(true);
      })
  }

  function handleLogin({ email, password }) {
    return auth.authorize(email, password)
      .then((data) => {
        console.log(data)
        if (data.jwt) {
          localStorage.setItem('jwt', data.jwt);
          tokenCheck();
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(`Ошибка...: ${err}`);
        setInfoToolTipData({ icon: false, title: 'Что-то пошло не так! Попробуйте ещё раз.' });
      })
      .finally(() => {
        setInfoToolTipOpen(true);
      })
  }

  function tokenCheck() {
    if (localStorage.getItem('jwt')){
      let jwt = localStorage.getItem('jwt');
      if (!jwt) {
        return setIsLoading(false);
      }
      auth.getContent(jwt)
        .then((res) => {
          const { _id, email } = res.data;
          setLoggedIn(true);
          setUserData({ _id, email });
        })
      .catch((err) => {
        console.log(`Ошибка...: ${err}`);
      })
    }
  }

  function handleLogout() {
      localStorage.removeItem('jwt');
      setLoggedIn(false);
      setUserData(null); /* setUserData({ _id, email }); */
      history.push('/signin');
    }

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
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
  }, [history, loggedIn]);

  // --------------------------------------------------------------------------

  return (
    isLoading ? (
      <Preloader />
    ) : (
      <CurrentUserContext.Provider value={ currentUser }>
        <div className="page">
          <Header 
            loggedIn={loggedIn} 
            onLogout={handleLogout} 
            userData={userData}
          />
            <Switch>

              <ProtectedRoute
                exact path="/"
                cards={cards}
                loggedIn={loggedIn}
                component={Main}
                onEditProfile={handleEditProfilePopupOpen}
                onAddPlace={handleAddPlacePopupOpen}
                onEditAvatar={handleEditAvatarPopupOpen}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDeletePopupOpen}>
                {/* <HeaderBar onLogout={handleLogout} /> */}
              </ProtectedRoute>

              <Route path="/signin">
                <Login onLogin={handleLogin} tokenCheck={tokenCheck} />
              </Route>

              <Route path="/signup">
                <Register onRegister={handleRegister} regStatus={regStatus} />
              </Route>

              <Route exact path="/">
                {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
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
          resStatus={resStatus}
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
    )
  ) 
}

export default App;

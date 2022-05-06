import React, { useState, useEffect } from 'react';
import '../index.css';
import { api } from '../utils/Api';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { ImagePopup } from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { DeleteConfirmPopup } from './DeleteConfirmPopup';

export function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setisDeleteConfirmPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [deleteCard, setDeleteCard] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = React.useState({name: '', about: '', avatar: ''});

  useEffect(() => {
    Promise.all([api.getProfile(), api.getCards()])
      .then(([data, cards]) => {
        setCurrentUser(data);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }
    document.addEventListener('keydown', closeByEscape);
      return () => document.removeEventListener('keydown', closeByEscape);
  }, [])

  function handleUpdateUser(data) {
    api.editProfile(data)
        .then(res => {
            setCurrentUser(res);
        })
        .then(() => {
            setEditProfilePopupOpen(false);
        })
        .catch((err) => {
            console.log(err);
        })
  }

  function handleUpdateAvatar(data) {
    api.updateAvatar(data)
        .then(res => {
            setCurrentUser(res);
        }) 
        .then(() => {
            setEditAvatarPopupOpen(false);
        })
        .catch((err) => {
            console.log(err);
        })
  }

  function handleAddPlaceSubmit(data) {
    api.addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then(() => {
        handleAddPlacePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
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

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setisDeleteConfirmPopupOpen(false);
    setSelectedCard(null); 
    }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
          <Header/>
          <Main
              cards={cards}
              onEditProfile={handleEditProfilePopupOpen}
              onAddPlace={handleAddPlacePopupOpen}
              onEditAvatar={handleEditAvatarPopupOpen}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDeletePopupOpen}
              >
          </Main>
          <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              buttonText='Сохранить'
              onUpdateUser={handleUpdateUser}
              onClose={closeAllPopups}
          />
          <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              buttonText='Создать'
              onAddPlace={handleAddPlaceSubmit}
              onClose={closeAllPopups}
          />
          <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              buttonText='Сохранить'
              onUpdateAvatar={handleUpdateAvatar}
              onClose={closeAllPopups}
          />
          <DeleteConfirmPopup
              isOpen={isDeleteConfirmPopupOpen}
              title='Вы уверены?'
              buttonText='Да'
              onDeleteConfirm={handleCardDelete}
              onClose={closeAllPopups}
              card={deleteCard}
          />
          <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}>
          </ImagePopup>
          <Footer/>
      </div>
    </CurrentUserContext.Provider>
  );
}
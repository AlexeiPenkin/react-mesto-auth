import React, { useState, useEffect } from 'react';
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
  const [currentUser, setCurrentUser] = React.useState({name: '', about: '', avatar: ''});
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setisDeleteConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
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

  const  closeAllPopups = () => {
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
              card={selectedCard}
              onClose={closeAllPopups}>
          </ImagePopup>
          <Footer/>
      </div>
    </CurrentUserContext.Provider>
  );
}
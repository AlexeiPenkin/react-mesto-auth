import {useState} from 'react';
import '../index.css';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { PopupWithForm } from './PopupWithForm';
import { ImagePopup } from './ImagePopup';

export function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

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

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(null);
    }

  return (
    <div className="page">
        <Header/>
        <Main
            onEditProfile={handleEditProfilePopupOpen}
            onAddPlace={handleAddPlacePopupOpen}
            onEditAvatar={handleEditAvatarPopupOpen}
            onCardClick={handleCardClick}>
        </Main>
        <PopupWithForm
            name='edit-profile'
            title='Редактировать профиль'
            buttonText='Сохранить'
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}>
            <input 
                className="form__input" 
                id='name' 
                name="name" 
                type="text" 
                placeholder='Введите имя' 
                maxLength="40" 
                minLength="2" 
                required/>
            <p className="form__input-error" id="text_name-error"/>
            <input 
                className="form__input" 
                id='job' 
                name="about" 
                type="text" 
                placeholder='Введите информацию о себе' 
                maxLength="200" 
                minLength="2" 
                required/>
            <p className="form__input-error" id="text_job-error"/>
        </PopupWithForm>
        <PopupWithForm
            name='add-card'
            title="Новое место"
            buttonText='Создать'
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}>
            <input 
                className="form__input" 
                id='name' 
                name="title" 
                type="text" 
                placeholder="Название" 
                maxLength="30" 
                minLength="1" 
                required/>
            <p className="form__input-error" id="card_title-error"/>
            <input 
                className="form__input" 
                id='link' 
                name="link" 
                type="url" 
                placeholder="Ссылка на картинку" 
                required/>
            <p className="form__input-error" id="card_link-error"/>
        </PopupWithForm>
        <PopupWithForm
            name="popup_update-avatar"
            title="Обновить аватар"
            buttonText='Сохранить'
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}>
            <input 
                className="form__input" 
                id="avatar" 
                name="avatar" 
                type="url" 
                placeholder="Ваш аватар" 
                required/>
            <p className='popup__input-error' id='avatar_link-error'/>
        </PopupWithForm>
        <PopupWithForm
            name="form_delete-confirm"
            title="Вы уверены?"
            buttonText="Да">
        </PopupWithForm>
        <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}>
        </ImagePopup>
        <Footer/>
    </div>
  );
}
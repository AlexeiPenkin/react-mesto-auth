import React, { useState, useEffect } from 'react';
import { PopupWithForm } from './PopupWithForm';
// import {CurrentUserContext} from "../contexts/CurrentUserContext";

export function AddPlacePopup(props) {
  // const currentUser = useContext(CurrentUserContext);

  const [name, setName] = useState([]);
  const [link, setLink] = useState([]);

  function handleCardName(e) {
    setName(e.target.value);
  }

  function handleCardLink(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({
      name: name,
      link: link
    })
  }

  useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen])

  return (
    <PopupWithForm
      name='add-card'
      title="Новое место"
      buttonText='Создать'
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
      onClose={props.onClose}
    >
      <input 
        className="form__input" 
        id='name' 
        name="title" 
        type="text" 
        placeholder="Название" 
        maxLength="30" 
        minLength="1" 
        onChange={handleCardName}
        value={name}
        required
      />
      <p className="form__input-error" id="card_title-error"/>
      <input 
        className="form__input" 
        id='link' 
        name="link" 
        type="url" 
        placeholder="Ссылка на картинку" 
        required
        value={link}
        onChange={handleCardLink}
      />
      <p className="form__input-error" id="card_link-error"/>
    </PopupWithForm>
  )
}
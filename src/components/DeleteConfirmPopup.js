import React from 'react';
import { PopupWithForm } from './PopupWithForm';


export function DeleteConfirmPopup(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onDeleteConfirm(props.card)
  }

  return (
    <PopupWithForm
      name={'popup_delete-confirm'}
      title={'Вы уверены?'}
      buttonText={'Да'}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isValid={true}
    />
  )
}
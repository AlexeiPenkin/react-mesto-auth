import React from 'react'; 
import { useEffect } from 'react';
import SuccessIcon from '../image/SuccessIcon.svg';
import ErrorIcon from '../image/ErrorIcon.svg';

export default function InfoTooltip({ title, icon, isOpen, onClose, onEscClose }) {
	// useEffect(
	// 	() => {
	// 		if (!isOpen) return;
	// 		const handleEscapeClose = (event) => {
	// 			if (event.key === 'Escape') {
	// 				onClose();
	// 			}
	// 		};
	// 		document.addEventListener('keydown', handleEscapeClose);
	// 		return () => {
	// 			document.removeEventListener('keydown', handleEscapeClose);
	// 		};
	// 	},
	// 	[ isOpen, onClose ]
	// );

  return (
    <div className={`popup popup_type_info-tooltip ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button
          className="popup__close-button"
          type="button"
          title="Закрыть"
          onClick={onClose}>
        </button>
        {icon
          ?
          (<img className="popup__success-icon" src={SuccessIcon} alt="успех"/>)
          :
          (<img className="popup__error-icon" src={ErrorIcon} alt="неудача"/>)
        }
        <h2 className="popup__title popup__title_type_info-tooltip">{`${title}`}</h2>
      </div>
    </div>
  );
}
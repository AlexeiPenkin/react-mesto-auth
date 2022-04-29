import React from 'react';


export function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup-image ${card ? 'popup_opened' : ''}`}>
      <div className="popup-image__container">
        <div className="popup-image__content">
          <button className="popup__close-button" type="button" title="Закрыть" onClick={onClose}/>
          <figure className="popup-image__figure">
            <img className="popup-image__image" src={card ? card.link : ''} alt={card ? card.name : ''}/>
            <p className="popup-image__title">{card ? card.name : ''}</p>
          </figure>
        </div>
      </div>
    </div>
  )
}
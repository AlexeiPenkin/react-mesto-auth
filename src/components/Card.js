import React from 'react';

export function Card({ card, onCardClick }) {

  function handleClick() {
    onCardClick(card);
  }

  return (
      <div className="card">
        <img
          className="card__image"
          src={card.link}
          name={card.name}
          alt={`Фотография: ${card.name}`}
          onClick={handleClick}/>
        <button
          className="card__delete-button"
          type="button"
          title="Удалить">
        </button>
        <div className="card__group">
          <h2 className="card__name">{card.name}</h2>
          <div className="card__group-like">
            <button 
              className="card__like-button"
              type="button"
              title="Нравится">
            </button>
            <p className="card__like-count">{card.likes.length}</p>
          </div>
        </div>
      </div>
  )
}
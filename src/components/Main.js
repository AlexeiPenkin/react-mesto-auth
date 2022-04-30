import { useState, useEffect } from 'react';
import { api } from '../utils/Api';
import { Card } from './Card';
// import { ImagePopup } from './ImagePopup';


export function Main(props) {
  const [userName, setUserName] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api.getProfile()
    .then(res => {
      setUserName(res.name);
      setUserDescription( res.about);
      setUserAvatar(res.avatar);
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);

  useEffect(() => {
    api.getCards()
    .then (cards => {
      cards.map(card => {
          return {
          name: card.name, 
          link: card.link,
          likes: card.likes,
          cardId: card._id,
          }
      })
      setCards(cards)
    })
    .catch((err) => {
    console.log(err);
    })
  }, [])
  
  return (
    <main className='content'>
      <section className="profile">
        <picture 
          className="profile__avatar-update"
          title="Обновить аватар" 
          onClick={props.onEditAvatar}>
          <img 
            className="profile__avatar" 
            style={{ backgroundImage: `url(${userAvatar})` }}
            src={userAvatar} 
            alt="Аватар"/>
        </picture>

        <div className="profile__info">
          <h1 className="profile__name">{userName}</h1>
          <button 
            className="profile__edit-button" 
            type="button" 
            title="Редактировать профиль"
            onClick={props.onEditProfile}>
          </button>
          <h2 className="profile__job">{userDescription}</h2> {/* h2 */}
        </div>

        <button 
          className="profile__add-button" 
          type="button" 
          title="Добавить новую карточку"
          onClick={props.onAddPlace}>
        </button>
      </section>

      <div className="card-list">
        {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              link={card.src}
              name={card.name}
              likes={card.likes.length}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
        ))}
      </div>
    </main>
  )
}
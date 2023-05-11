import React from 'react'
import styles from './Card.module.scss'

function Card({ title, price, imageUrl, onFavorite, onPlus }) {
    const [isAdded, setIsadded] = React.useState();

    const onClickPlus = () => {
        onPlus({ title, price, imageUrl });
        setIsadded(!isAdded);
    }

    return (
        <div className={styles.card}>
            <div className={styles.favorite} onClick={onFavorite}>
                <img width={32} height={32} src="/img/unliked.svg" alt="Unliked" />
            </div>
            <img width={133} height={112} src={imageUrl} alt="Sneakers" />
            <h5>{title}</h5>
            <div className="d-flex justify-between aling-center">
                <div className="d-flex flex-column">
                    <span>Цена:</span>
                    <b>{price} руб.</b>
                </div>
                <img className='cu-p' onClick={onClickPlus} src={isAdded ? "/img/btn-checked.svg" : "/img/btn-plus.svg"} alt="AddItem" />
            </div>
        </div>
    );
}

export default Card;

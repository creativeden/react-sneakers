import React from 'react'
import styles from './Card.module.scss'

function Card(props) {
    const [isAdded, setIsadded] = React.useState();

    const onClickPlus = () => {
        setIsadded(!isAdded);
    }

    return (
        <div className={styles.card}>
            <div className={styles.favorite} onClick={props.onFavorite}>
                <img width={32} height={32} src="/img/unliked.svg" alt="Unliked" />
            </div>
            <img width={133} height={112} src={props.imageUrl} alt="Sneakers" />
            <h5>{props.title}</h5>
            <div className="d-flex justify-between aling-center">
                <div className="d-flex flex-column">
                    <span>Цена:</span>
                    <b>{props.price} руб.</b>
                </div>
                <img className='cu-p' onClick={onClickPlus} src={isAdded ? "/img/btn-checked.svg" : "/img/btn-plus.svg"} alt="AddItem" />
            </div>
        </div>
    );
}

export default Card;

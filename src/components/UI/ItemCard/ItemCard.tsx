import { createRef, useEffect, useRef } from "react";
import Button from "../Button/Button";
import styles from './itemCard.module.css'


export interface ItemCardProps {
    title: string;
    description: string;
    img?: string; //| Base64URLString | Blob
    buttonTxt: string;
}

const ItemCard = ({title, description, img, buttonTxt}: ItemCardProps) => {
    //const price: number | string = "TBA";
    const btnRef = createRef<HTMLButtonElement>();
    useEffect(() => {
        if (btnRef.current) btnRef.current.className = `${btnRef.current.className} ${styles.itemCardBtn}`
    }, [btnRef.current])
    return ( 
        <article className={`content-block ${styles.itemCard}`}>
            <div className={styles.itemCardContainer}>
                <div className={styles.itemCardContent}>
                    <div className={styles.contentImgContainer}>
                        <img className={styles.contentImg} src={img ?? '/images/placeholders/thumbnail.webp'} alt="" />
                    </div>
                    <div className={styles.descriptionContent}>
                        <h4 className={styles.title}>{title}</h4>
                        <p className={styles.description}>{description}</p>
                    </div>
                </div>
                <Button ref={btnRef} onClick={() => console.log("BUTTON CLICKED!")}>{buttonTxt}</Button> 
            </div>
        </article>
    );
}
//{`Купить за ${price}`}
export default ItemCard;
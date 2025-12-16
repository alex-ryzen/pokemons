
import { FC, HTMLAttributes, ImgHTMLAttributes } from 'react';
import styles from './loader.module.css'

type LoaderProps = {
    containerProps?: HTMLAttributes<HTMLDivElement>,
    imageProps?: ImgHTMLAttributes<HTMLImageElement>
}

const Loader: FC<LoaderProps> = ({containerProps, imageProps}) => {
    return (
        <div {...containerProps} className={styles.lodaerContainer}>
            <img
                {...imageProps}
                className={styles.loaderImg} 
                src="./gifs/running_pikachu.gif" 
                alt="Loading..." 
            />
        </div>
    );
}
 
export default Loader;
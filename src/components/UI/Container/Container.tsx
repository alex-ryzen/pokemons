import { CSSProperties, ReactNode } from 'react';
import styles from './container.module.css'

interface ContainerProps {
    container_id: number;
    style?: CSSProperties;
    children: ReactNode;
}

const Container = ({container_id=0, style, children}: ContainerProps) => {
    return ( 
        <div className={styles.containerWrapper}>
            <div className={styles.container} data-id={container_id} style={style}>
                {children}
            </div> 
        </div>
    );
}
 
export default Container;
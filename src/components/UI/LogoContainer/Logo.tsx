import styles from './logo.module.css'
import { Link } from 'react-router'

const Logo = () => {
    return ( 
        <Link to={'/'} style={{height: '100%'}}>
            <div className={styles['logo-container']}>
                <img src={'./images/logo/pokemons_logo.png'} alt="Pokemon" className={styles.logo} />
                <hr className={styles.separator}></hr>
                <img src={'./images/logo/clicker_logo.png'} alt="Clicker" className={styles.logo}/>
            </div>
        </Link>
    );
}
 
export default Logo;
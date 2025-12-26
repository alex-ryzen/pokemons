import { Link } from 'react-router';
import Button from '../../components/UI/Button/Button';
import styles from './errorpage.module.css'

const ErrorPage = () => {
    return ( 
        <div className={styles.errorPage}>
            <img src="/images/pokemons404.png" alt="404 - Not Found" />
            <Button><Link style={{padding: 12, color: "white"}} to={"/"}>Return</Link></Button>
        </div>
    );
}
 
export default ErrorPage;
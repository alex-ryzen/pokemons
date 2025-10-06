import styles from './header.module.css'
import BlockTitle from '../BlockTitle/BlockTitle'
import Logo from '../LogoContainer/Logo';
import { formatBalance } from '../../../utils/formatters';


interface HeaderProps {

}

const Header = (headerProps: HeaderProps) => {
    
    return ( 
        <header className={`${styles['header']} content-block`} id="header">
            <div className={styles['header-container']}>
                <Logo/>
                <div className={styles['user-container']}>
                    <div className={styles['user-profile']}></div>
                    <div className={styles['balance-container']}>
                        <img src={'./images/icon/pokecoin.png'} alt="" className={styles['balance-coin-icon']}/>
                        <BlockTitle>{formatBalance(100000000)}</BlockTitle>
                    </div>
                </div>
            </div>
        </header> 
    );
}
 
export default Header;
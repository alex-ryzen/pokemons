
import pokemonsLogo from '../../../../public/images/logo/pokemons_logo.png'
import clickerLogo from '../../../../public/images/logo/clicker_logo.png'
import coinIcon from '../../../../public/images/icon/pokecoin.png'
import styles from './header.module.css'
import BlockTitle from '../BlockTitle/BlockTitle'


interface HeaderProps {

}

const Header = (headerProps: HeaderProps) => {
    
    const formatBalance = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
    
    return ( 
        <header className="header" id="header">
            <div className={styles['header-container']}>
                <div className={styles['logo-container']}>
                    {/* use as a Link */}
                    <img src={pokemonsLogo} alt="Pokemon" className={styles.logo} />
                    <hr className={styles.separator}></hr>
                    <img src={clickerLogo} alt="Clicker" className={styles.logo}/>
                </div>
                <div className={styles['user-container']}>
                    <div className={styles['user-profile']}></div>
                    <div className={styles['balance-container']}>
                        <img src={coinIcon} alt="" className={styles['balance-coin-icon']}/>
                        <BlockTitle text={formatBalance(100000000)}/>
                    </div>
                </div>
            </div>
        </header> 
    );
}
 
export default Header;
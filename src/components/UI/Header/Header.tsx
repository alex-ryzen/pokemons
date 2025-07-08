
import pokemonsLogo from '../../../../public/images/logo/pokemons_logo.png'
import clickerLogo from '../../../../public/images/logo/clicker_logo.png'

interface HeaderProps {

}

const Header = (headerProps: HeaderProps) => {
    return ( 
        <header className="header" id="header">
            <div className="headerContainer">
                <div className="logoContainer">
                    {/* use as a Link */}
                    <img src={pokemonsLogo} alt="Pokemon" className="logo" />
                    <hr className='separator'></hr>
                    <img src={clickerLogo} alt="Clicker" />
                </div>
                <div className="userContainer"></div>
            </div>
        </header> 
    );
}
 
export default Header;
import { FC } from 'react';
import Balance from '../Balance/Balance';
import Button from '../Button/Button';
import styles from './gardenService.module.css'
import { IGardenService } from '../../../types/app';

interface GardenServiceProps {
    gardenService: Partial<IGardenService>;
}

const GardenService:FC<GardenServiceProps> = ({gardenService}) => {
    return ( 
        <div>
            <p className={styles.serviceTitle}>{gardenService.title}</p>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <Button><span>Купить</span></Button>
                <Balance amount={gardenService.price}/>
            </div>
        </div>    
    );
}
 
export default GardenService;
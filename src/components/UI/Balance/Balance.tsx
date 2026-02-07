import { FC } from 'react';
import { formatBalance } from '../../../utils/formatters';
import BlockTitle from '../BlockTitle/BlockTitle';
import styles from './balance.module.css'

interface BalanceProps {
    amount?: number | string;
}

const Balance: FC<BalanceProps> = ({amount = 0}) => {
    return (
        <div className={styles["balance-container"]}>
            <img
                src={"./images/icon/pokecoin.png"}
                alt=""
                className={styles["balance-coin-icon"]}
            />
            <BlockTitle>{formatBalance(amount)}</BlockTitle>
        </div>
    );
}

export default Balance;
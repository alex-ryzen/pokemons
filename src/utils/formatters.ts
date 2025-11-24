
// const formattedNumber = new Intl.NumberFormat('ru-RU').format(1234567);
// // Результат: "1 234 567"

/**
 * Alternative to Intl.NumberFormat
 * @param num 
 * @returns Formatted number string 
 */
export const formatBalance = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
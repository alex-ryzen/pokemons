
// const formattedNumber = new Intl.NumberFormat('ru-RU').format(1234567);
// // Результат: "1 234 567"

/**
 * Alternative to Intl.NumberFormat
 * @param num 
 * @returns Formatted number string 
 */
export const formatBalance = (num: number | bigint | string): string => {
    if (typeof num === "string") num = Number(num);
    return new Intl.NumberFormat('ru-RU').format(num);
    // return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
export default class Currency {

    public static Format(money: bigint): string {
        let formatter = Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'EUR'
        });
        let s = money.toString();
        s = s.padStart(2, '0');
        s = s.slice(0, -2) + '.' + s.slice(-2);
        return formatter.format(s as unknown as number);
    }
}
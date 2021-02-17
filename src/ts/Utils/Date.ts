export default class DateTime {

    public static ToInputFormat(date: Date) {
        let formatted = date.getFullYear().toString().padStart(4, '0') + '-' +
            date.getMonth().toString().padStart(2, '0') + '-' +
            date.getDate().toString().padStart(2, '0') + 'T' +
            date.getHours().toString().padStart(2, '0') + ':' +
            date.getMinutes().toString().padStart(2, '0');
        return formatted;
    }
}
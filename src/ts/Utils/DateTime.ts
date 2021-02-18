export default class DateTime {

    /**
     * Returns date and time formatted as the <input> format yyyy-MM-ddThh:mm
     * @param date The date to convert
     */
    public static ToInputFormat(date: Date) {
        let formatted = date.getFullYear().toString().padStart(4, '0') + '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
            date.getDate().toString().padStart(2, '0') + 'T' +
            date.getHours().toString().padStart(2, '0') + ':' +
            date.getMinutes().toString().padStart(2, '0');
        return formatted;
    }

    /**
     * Returns date and time formatted not to display seconds
     * @param date The date to convert
     */
    public static ToStandardString(date: Date) {
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }
}
export default class DateTime {

    public static ToInputFormat(date: Date) {
        return date.toISOString().substr(0, 16);
    }
}
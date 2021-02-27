export default class SessionStorage {

    /**
     * Returns the value associated with a given key
     * @param key The key to look up for
     */
    public static Get(key: string) {
        return sessionStorage.getItem(key);
    }

    /**
     * Stores a value in the session storage
     * @param key The key to which associate the value
     * @param value The value to store or null to remove it
     */
    public static Set(key: string, value: string | null) {
        if(value === null) {
            sessionStorage.removeItem(key);
        } else {
            sessionStorage.setItem(key, value);
        }
    }
}
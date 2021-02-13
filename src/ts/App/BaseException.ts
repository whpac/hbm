/** Serves as a base class for every application exception */
export default class BaseException {
    /** Holds the exception message */
    public readonly Message: string;

    /**
     * Serves as a base class for every application exception
     * @param message The exception message
     */
    public constructor(message: string) {
        this.Message = message;
        console.info(`Exception thrown: ${message}`);
    }
}
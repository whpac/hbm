export default class NetworkErrorException {
    /** Holds the exception message */
    public readonly Message: string;

    public constructor(message: string) {
        this.Message = message;
    }
}
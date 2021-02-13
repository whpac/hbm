import BaseException from '../App/BaseException';

/** Represents an exception that is thrown as a result of a network error */
export default class NetworkErrorException extends BaseException {

    /**
     * Represents an exception that is thrown as a result of a network error
     * @param message The exception message
     */
    public constructor(message: string) {
        super(message);
    }
}
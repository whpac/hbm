import BaseException from '../App/BaseException';

/** Represents an exception that is thrown when the network response is malformed */
export default class MalformedResponseException extends BaseException {
    /** The response data */
    public readonly ResponseData: MalformedResponseExceptionData;

    /**
     * Represents an exception that is thrown when the network response is malformed
     * @param message The exception message
     * @param data Response data
     */
    public constructor(message: string, data: MalformedResponseExceptionData) {
        super(message);
        this.ResponseData = data;
    }
}

interface MalformedResponseExceptionData {
    Status: number;
    StatusText: string;
    ResponseText: string;
}
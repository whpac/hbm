import BaseException from '../App/BaseException';

/** Represents an exception being thrown when the network request fails */
export default class RequestFailedException extends BaseException {
    /** Contains information about the failed request response */
    public readonly ResponseData: RequestFailedExceptionData;

    /**
     * Represents an exception being thrown when the network request fails
     * @param message The exception message
     * @param data The data about failed exception
     */
    public constructor(message: string, data: RequestFailedExceptionData) {
        super(message);
        this.ResponseData = data;
    }
}

interface RequestFailedExceptionData {
    Status: number;
    StatusText: string;
    Response: any;
}
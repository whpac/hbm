export default class MalformedResponseException {
    /** Holds the exception message */
    public readonly Message: string;
    /** The response data */
    public readonly ResponseData: MalformedResponseExceptionData;

    public constructor(message: string, data: MalformedResponseExceptionData) {
        this.Message = message;
        this.ResponseData = data;
    }
}

interface MalformedResponseExceptionData {
    Status: number;
    StatusText: string;
    ResponseText: string;
}
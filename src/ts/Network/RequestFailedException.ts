export default class RequestFailedException {
    /** Holds the exception message */
    public readonly Message: string;
    /** Contains information about the failed request response */
    public readonly ResponseData: RequestFailedExceptionData;

    public constructor(message: string, data: RequestFailedExceptionData) {
        this.Message = message;
        this.ResponseData = data;
    }
}

interface RequestFailedExceptionData {
    Status: number;
    StatusText: string;
    Response: any;
}
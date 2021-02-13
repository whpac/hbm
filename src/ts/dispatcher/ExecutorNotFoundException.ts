import BaseException from '../App/BaseException';

/** Represents an exception thrown when there is no executor for a given request */
export default class ExecutorNotFoundException extends BaseException {
    /** The identifier of the requested executor */
    public readonly ExecutorId: string;

    /**
     * Represents an exception thrown when there is no executor for a given request
     * @param message The exception message
     * @param executor_id Identifier of the executor that hadn't been found
     */
    public constructor(message: string, executor_id: string) {
        super(message);
        this.ExecutorId = executor_id;
    }
}
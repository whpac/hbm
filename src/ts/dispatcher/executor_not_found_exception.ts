export default class ExecutorNotFoundException {
    /** The message associated with this exception */
    public readonly Message: string;
    /** The identifier of the requested executor */
    public readonly ExecutorId: string;

    public constructor(message: string, executor_id: string) {
        this.Message = message;
        this.ExecutorId = executor_id;
    }
}
import RequestExecutor from './RequestExecutor';

export default interface ExecutorStorage {

    /**
     * Returns the executor or undefined if not found
     * @param executor_id The identifier of an executor
     */
    Retrieve(executor_id: string): Promise<RequestExecutor | undefined> | RequestExecutor | undefined;
}
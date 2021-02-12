import Command from './command';
import ExecutorNotFoundException from './executor_not_found_exception';
import ExecutorStorage from './executor_storage';
import RequestExecutor from './request_executor';

export default class RequestDispatcher {
    protected Executors: ExecutorStorage | undefined;

    /**
     * Processes the URI and invokes appropriate controller
     * @param uri The URI to parse
     */
    public Dispatch(uri: string): void {
        let command = this.ReadCommand(uri);
        let executor = this.GetExecutor(command.Callee);

        try {
            executor.Execute(command);
        } catch(e) {

        }
    }

    public SetExecutorStorage(storage: ExecutorStorage): void {
        this.Executors = storage;
    }

    /**
     * Reads a command from the URI address
     * @param uri The URI
     */
    protected ReadCommand(uri: string): Command {
        return new Command(uri);
    }

    /**
     * Returns an executor for a given callee name.
     * If the requested identifier doesn't exist, throws an ExecutorNotFoundException.
     * @param callee Identifier of a controller to invoke
     */
    protected GetExecutor(callee: string): RequestExecutor {
        let executor = this.Executors?.Retrieve(callee);

        if(executor === undefined) {
            throw new ExecutorNotFoundException(`Request executor with id '${callee}' hasn't been found.`, callee);
        }

        return executor;
    }
}
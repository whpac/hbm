import Command from './Command';
import ExecutorNotFoundException from './ExecutorNotFoundException';
import ExecutorStorage from './ExecutorStorage';
import RequestExecutor from './RequestExecutor';

export default class RequestDispatcher {
    protected Executors: ExecutorStorage | undefined;

    /**
     * Processes the URI and invokes appropriate controller
     * @param uri The URI to parse
     */
    public async Dispatch(uri: string): Promise<void> {
        let command = this.ReadCommand(uri);

        try {
            let executor = await this.GetExecutor(command.Callee);
            await executor.Execute(command);
        } catch(e) {
            // TODO: Display it in a nice way
            alert('There was an error while loading the page.');
            console.error(e);
        }
    }

    /**
     * Sets the object holding executors
     * @param storage The storage object
     */
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
    protected async GetExecutor(callee: string): Promise<RequestExecutor> {
        let executor = await this.Executors?.Retrieve(callee);

        if(executor === undefined) {
            throw new ExecutorNotFoundException(`Request executor with id '${callee}' hasn't been found.`, callee);
        }

        return executor;
    }
}
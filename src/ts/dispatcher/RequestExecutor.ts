import Command from './Command';

export default interface RequestExecutor {

    /**
     * Executes the request
     * @param command Command to execute
     */
    Execute(command: Command): void;
}
import Command from './command';

export default interface RequestExecutor {

    Execute(command: Command): void;
}
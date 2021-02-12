export default class Command {
    /** Holds an identifier of the called controller */
    public readonly Callee: string;
    /** Contains arguments (if any) passed to the controller */
    public readonly Arguments: string[];

    public constructor(callee: string, args: string[] = []) {
        this.Callee = callee;
        this.Arguments = args;
    }
}
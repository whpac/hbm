export default class ElementNotFoundException {
    /** Holds the exception message */
    public readonly Message: string;
    /** Contains the identifier of the requested resource */
    public readonly ElementId: bigint;

    public constructor(message: string, element_id: bigint) {
        this.Message = message;
        this.ElementId = element_id;
    }
}
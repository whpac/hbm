import BaseException from '../App/BaseException';

/** Represents an exception that is thrown when collection doesn't */
export default class ElementNotFoundException extends BaseException {
    /** Contains the identifier of the requested resource */
    public readonly ElementId: bigint;

    /**
     * Represents an exception that is thrown when collection doesn't
     * contain an element with the given id.
     * @param message The exception message
     * @param element_id The identifier of the inexistant collection member
     */
    public constructor(message: string, element_id: bigint) {
        super(message);
        this.ElementId = element_id;
    }
}
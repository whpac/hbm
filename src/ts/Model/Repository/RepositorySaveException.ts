import BaseException from '../../App/BaseException';

/** Represents an exception thrown when it's impossible to save data to a repository */
export default class RepositorySaveException extends BaseException {
    /** Holds the exception that prevented from saving to the repository */
    public readonly InnerException: BaseException | undefined;

    /**
     * Represents an exception thrown when it's impossible to save data to a repository
     * @param message The exception message
     * @param inner The exception that prevented the repository manager from saving the data
     */
    public constructor(message: string, inner?: BaseException) {
        super(message);
        this.InnerException = inner;
    }
}
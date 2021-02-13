import BaseException from '../../App/BaseException';

/** Represents an exception thrown when it's impossible to fetch data from a repository */
export default class RepositoryFetchException extends BaseException {
    /** Contains the causing exception */
    public readonly InnerException: BaseException;

    /**
     * Represents an exception thrown when it's impossible to fetch data from a repository
     * @param message The exception message
     * @param inner The exception that prevented the repository manager from fetching the data
     */
    public constructor(message: string, inner: BaseException) {
        super(message);
        this.InnerException = inner;
    }
}
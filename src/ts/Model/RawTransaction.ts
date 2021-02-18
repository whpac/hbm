export default interface RawTransaction {
    /** The transaction's identifier */
    readonly Id: bigint | undefined;
    /** The transaction's name */
    Name: string;
    /** The description of the transaction */
    Description: string;
    /** The amount of money that was transferred */
    Price: bigint;
    /** Date and time when the transaction took place */
    DateTime: Date;
    /** Type of the transaction */
    CategoryId: bigint;
    /** Whether the transaction has been finished */
    //IsFinished: boolean;
    /** Identifier of a referenced transaction */
    //TransactionIdReference: bigint | null;
}
export default class Transaction {
    /** The transaction's identifier */
    public readonly Id: bigint;
    /** The transaction's name */
    public Name: string;
    /** The description of the transaction */
    public Description: string;
    /** The amount of money that was transferred */
    public Price: bigint;
    /** Date and time when the transaction took place */
    public DateTime: Date;
    /** Type of the transaction */
    public Category: never;
    /** Whether the transaction has been finished */
    public IsFinished: boolean;
    /** Identifier of a referenced transaction */
    public TransactionIdReference: bigint | null;

    public constructor(
        id: bigint, name: string, description: string, price: bigint, date_time: Date,
        category: never, is_finished: boolean, ref_id: bigint | null) {
        this.Id = id;
        this.Name = name;
        this.Description = description;
        this.Price = price;
        this.DateTime = date_time;
        this.Category = category;
        this.IsFinished = is_finished;
        this.TransactionIdReference = ref_id;
    }
}
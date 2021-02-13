import TransactionCollection from './TransactionCollection';

export default class Wallet {
    /** The wallet identifier */
    public readonly Id: bigint;
    /** The wallet name */
    public Name: string;
    /** The current balance */
    public Balance: bigint;
    /** The wallet's owner */
    public Owner: never;
    /** List of transactions done over with this wallet */
    protected Transactions: TransactionCollection | undefined;

    public constructor(id: bigint, name: string, balance: bigint, owner: never) {
        this.Id = id;
        this.Name = name;
        this.Balance = balance;
        this.Owner = owner;
    }

    public GetTransactions() {

    }
}
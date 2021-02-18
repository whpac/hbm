import ElementNotFoundException from './ElementNotFoundException';
import RawTransaction from './RawTransaction';
import TransactionRepository from './Repository/TransactionRepository';
import Transaction from './Transaction';
import Wallet from './Wallet';

export default class TransactionCollection {
    protected Transactions: Map<bigint, Transaction>;
    protected Wallet: Wallet;

    /**
     * Creates a transaction collection for a given wallet.
     * If fails, throws a RepositoryFetchException.
     * @param wallet The wallet for which to fetch the transactions
     */
    public static async CreateForWallet(wallet: Wallet): Promise<TransactionCollection> {
        let transactions = await TransactionRepository.GetAllTransactions(wallet);
        return new TransactionCollection(transactions, wallet);
    }

    protected constructor(transactions: Transaction[], wallet: Wallet) {
        this.Transactions = new Map();
        this.Wallet = wallet;

        for(let transaction of transactions) {
            this.Transactions.set(transaction.Id, transaction);
        }
    }

    /**
     * Returns a transaction with the specified id. If it doesn't exist,
     * an ElementNotFoundException is thrown.
     * @param id Id of the transaction to return.
     */
    public async GetTransactionById(id: bigint): Promise<Transaction> {
        if(this.Transactions.has(id)) {
            return this.Transactions.get(id)!;
        }

        try {
            let transaction = await TransactionRepository.GetTransactionById(id, this.Wallet);
            if(transaction !== undefined) {
                this.Transactions.set(id, transaction);
                return transaction;
            }
        } catch(e) {
            // It means the download has failed. Throw an ElementNotFoundException then.
        }

        throw new ElementNotFoundException(`Transaction with id '${id}' doesn't exist in this collection.`, id);
    }

    /**
     * Returns all transactions in this collection.
     */
    public GetAllTransactions(): Transaction[] {
        return Array.from(this.Transactions.values());
    }

    /**
     * Creates a new transaction in this collection
     * @param transaction Transaction data
     */
    public async CreateNew(transaction_data: RawTransaction): Promise<Transaction> {
        let transaction = await TransactionRepository.CreateNewTransaction(this.Wallet, transaction_data);
        this.Transactions.set(transaction.Id, transaction);
        return transaction;
    }
}
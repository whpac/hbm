import ElementNotFoundException from './ElementNotFoundException';
import RawTransaction from './RawTransaction';
import TransactionRepository from './Repository/TransactionRepository';
import Transaction from './Transaction';
import Wallet from './Wallet';

type EventNames = 'TransactionAdded' | 'TransactionRemoved';
type EventHandler = (sender: TransactionCollection, event_data: TransactionCollectionEventData) => void;
export type TransactionCollectionEventData = {
    EventName: EventNames;
    Transaction: Transaction;
};

export default class TransactionCollection {
    protected Transactions: Map<bigint, Transaction>;
    protected Wallet: Wallet;

    protected EventHandlers: Map<EventNames, EventHandler[]>;

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
        this.EventHandlers = new Map();

        for(let transaction of transactions) {
            transaction.AddEventListener('Removed', this.OnTransactionRemoved.bind(this));
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
                transaction.AddEventListener('Removed', this.OnTransactionRemoved.bind(this));
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
     * Creates a new transaction in this collection. If fails, throws a RepositorySaveException.
     * @param transaction Transaction data
     */
    public async CreateNew(transaction_data: RawTransaction): Promise<Transaction> {
        let transaction = await TransactionRepository.CreateNewTransaction(this.Wallet, transaction_data);
        transaction.AddEventListener('Removed', this.OnTransactionRemoved.bind(this));
        this.Transactions.set(transaction.Id, transaction);
        this.FireEvent('TransactionAdded', transaction);
        return transaction;
    }

    protected OnTransactionRemoved(transaction: Transaction) {
        this.Transactions.delete(transaction.Id);
        this.FireEvent('TransactionRemoved', transaction);
    }

    /**
     * Registers an event handler
     * @param event_name Name of an event to handle
     * @param handler The event handler
     */
    public AddEventListener(event_name: EventNames, handler: EventHandler) {
        if(!this.EventHandlers.has(event_name)) {
            this.EventHandlers.set(event_name, []);
        }
        let handlers = this.EventHandlers.get(event_name);
        handlers?.push(handler);
    }

    /**
     * Fires an event
     * @param event_name The name of the event to fire
     * @param transaction The transaction that caused the event
     */
    protected FireEvent(event_name: EventNames, transaction: Transaction) {
        let handlers = this.EventHandlers.get(event_name) ?? [];
        for(let handler of handlers) {
            handler(this, {
                EventName: event_name,
                Transaction: transaction
            });
        }
    }
}
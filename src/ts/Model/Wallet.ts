import DependencyProperty from './DependencyProperty';
import WalletRepository from './Repository/WalletRepository';
import TransactionCollection, { TransactionCollectionEventData } from './TransactionCollection';

type EventNames = 'BalanceChanged' | 'NameChanged' | 'Removed';
type EventHandler = (sender: Wallet, data: WalletEventData) => void;
export type WalletEventData = {
    EventName: EventNames;
};

export default class Wallet {
    protected _Name: DependencyProperty<string>;
    protected _Balance: DependencyProperty<bigint>;

    /** The wallet identifier */
    public readonly Id: bigint;
    /** The wallet name */
    public get Name(): string {
        return this._Name.Get();
    }
    /** The current balance */
    public get Balance(): bigint {
        return this._Balance.Get();
    }
    /** The wallet's owner */
    public Owner: never;
    /** List of transactions done over with this wallet */
    protected Transactions: TransactionCollection | undefined;

    protected EventHandlers: Map<EventNames, EventHandler[]>;

    public constructor(id: bigint, name: string, balance: bigint, owner: never) {
        this.Id = id;
        this._Name = new DependencyProperty(name);
        this._Balance = new DependencyProperty(balance);
        this.Owner = owner;

        this.EventHandlers = new Map();
        this._Balance.AddOnChange((() => this.FireEvent('BalanceChanged')).bind(this));
        this._Name.AddOnChange((() => this.FireEvent('NameChanged')).bind(this));
    }

    /**
     * Returns a colletion of transactions for this wallet.
     * A RepositoryFetchException is thrown when it's impossible to load
     * the transactions.
     */
    public async GetTransactions(): Promise<TransactionCollection> {
        if(this.Transactions === undefined) {
            this.Transactions = await TransactionCollection.CreateForWallet(this);
            this.Transactions.AddEventListener('TransactionAdded', this.OnTransactionAdded.bind(this));
            this.Transactions.AddEventListener('TransactionRemoved', this.OnTransactionRemoved.bind(this));
        }
        return this.Transactions;
    }

    /**
     * Renames the wallet. If fails, throws a RepositorySaveException
     * @param new_name The new wallet name
     */
    public async Rename(new_name: string) {
        await WalletRepository.RenameWallet(this, new_name);

        this._Name.Set(new_name);
    }

    public async Remove() {
        await WalletRepository.RemoveWallet(this);

        this.FireEvent('Removed');
    }

    protected OnTransactionAdded(coll: TransactionCollection, data: TransactionCollectionEventData) {
        if(data.Transaction.Category.IsExpense) {
            this._Balance.Set(this.Balance - data.Transaction.Price);
        } else {
            this._Balance.Set(this.Balance + data.Transaction.Price);
        }
    }

    protected OnTransactionRemoved(coll: TransactionCollection, data: TransactionCollectionEventData) {
        if(data.Transaction.Category.IsExpense) {
            this._Balance.Set(this.Balance + data.Transaction.Price);
        } else {
            this._Balance.Set(this.Balance - data.Transaction.Price);
        }
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
    protected FireEvent(event_name: EventNames) {
        let handlers = this.EventHandlers.get(event_name) ?? [];
        for(let handler of handlers) {
            handler(this, {
                EventName: event_name
            });
        }
    }
}
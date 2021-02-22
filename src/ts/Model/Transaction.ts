import DependencyProperty from './DependencyProperty';
import RawTransaction from './RawTransaction';
import TransactionRepository from './Repository/TransactionRepository';
import TransactionCategory from './TransactionCategory';
import Wallet from './Wallet';

type EventNames = 'DateTimeChanged' | 'DescriptionChanged' | 'MoneyChanged' | 'NameChanged' | 'Removed';
type EventHandler = (sender: Transaction, data: TransactionEventData) => void;
export type TransactionEventData = {
    EventName: EventNames;
};

export default class Transaction {
    protected readonly _Name: DependencyProperty<string>;
    protected readonly _Description: DependencyProperty<string>;
    protected readonly _Price: DependencyProperty<bigint>;
    protected readonly _DateTime: DependencyProperty<Date>;

    /** The wallet the transaction is in */
    protected Wallet: Wallet;
    /** The transaction's identifier */
    public readonly Id: bigint;
    /** The transaction's name */
    public get Name(): string {
        return this._Name.Get();
    }
    /** The description of the transaction */
    public get Description(): string {
        return this._Description.Get();
    }
    /** The amount of money that was transferred */
    public get Price(): bigint {
        return this._Price.Get();
    }
    /** Date and time when the transaction took place */
    public get DateTime(): Date {
        return this._DateTime.Get();
    }
    /** Type of the transaction */
    public Category: TransactionCategory;
    /** Whether the transaction has been finished */
    public IsFinished: boolean;
    /** Identifier of a referenced transaction */
    public TransactionIdReference: bigint | null;

    protected EventHandlers: Map<EventNames, EventHandler[]>;

    public constructor(
        id: bigint, name: string, description: string, price: bigint, date_time: Date,
        category: TransactionCategory, is_finished: boolean, ref_id: bigint | null,
        wallet: Wallet) {
        this.Id = id;
        this._Name = new DependencyProperty(name);
        this._Description = new DependencyProperty(description);
        this._Price = new DependencyProperty(price);
        this._DateTime = new DependencyProperty(date_time);
        this.Category = category;
        this.IsFinished = is_finished;
        this.TransactionIdReference = ref_id;
        this.Wallet = wallet;

        this.EventHandlers = new Map();
        this._Description.AddOnChange((() => this.FireEvent('DescriptionChanged')).bind(this));
        this._Name.AddOnChange((() => this.FireEvent('NameChanged')).bind(this));
        this._Price.AddOnChange((() => this.FireEvent('MoneyChanged')).bind(this));
        this._DateTime.AddOnChange((() => this.FireEvent('DateTimeChanged')).bind(this));
    }

    /**
     * Saves changes to the transaction. If fails throws a RepositorySaveException.
     * @param transaction_data The new field values
     */
    public async MakeChanges(transaction_data: RawTransaction) {
        await TransactionRepository.EditTransaction(this.Wallet, transaction_data);

        this._Name.Set(transaction_data.Name);
        this._Description.Set(transaction_data.Description);
        this._Price.Set(transaction_data.Price);
        this._DateTime.Set(transaction_data.DateTime);
    }

    /**
     * Removes the transaction
     */
    public async Remove() {
        await TransactionRepository.RemoveTransaction(this.Wallet, this);

        this.FireEvent('Removed');
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
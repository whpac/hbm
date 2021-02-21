import Transaction, { TransactionEventData } from '../../Model/Transaction';
import TransactionCategory from '../../Model/TransactionCategory';

type TransactionDtoProperty = 'DateTime' | 'Description' | 'Name' | 'Price';
type BindingFunction<T> = (value: T) => void;

export default class TransactionDto {
    public readonly Id: bigint | undefined;
    public Name: string;
    public Description: string;
    public Price: bigint;
    public DateTime: Date;
    public CategoryId: bigint;
    public CategoryName: string;
    public CategoryDescription: string;
    public IsExpense: boolean;

    protected Bindings: Map<TransactionDtoProperty, BindingFunction<any>[]>;

    constructor(transaction: Transaction);
    constructor(id: bigint | undefined, name: string, description: string, price: bigint, date_time: Date, category: TransactionCategory);
    public constructor(
        transaction_or_id: Transaction | bigint | undefined, name?: string, description?: string,
        price?: bigint, date_time?: Date, category?: TransactionCategory) {

        if(typeof transaction_or_id === 'bigint' || transaction_or_id === undefined) {
            this.Id = transaction_or_id;
            this.Name = name!;
            this.Description = description!;
            this.Price = price!;
            this.DateTime = date_time!;
            this.CategoryId = category!.Id;
            this.CategoryName = category!.Name;
            this.CategoryDescription = category!.Description;
            this.IsExpense = category!.IsExpense;

            this.Bindings = new Map();
        } else {
            this.Id = transaction_or_id.Id;
            this.Name = transaction_or_id.Name;
            this.Description = transaction_or_id.Description;
            this.Price = transaction_or_id.Price;
            this.DateTime = transaction_or_id.DateTime;
            this.CategoryId = transaction_or_id.Category.Id;
            this.CategoryName = transaction_or_id.Category.Name;
            this.CategoryDescription = transaction_or_id.Category.Description;
            this.IsExpense = transaction_or_id.Category.IsExpense;

            this.Bindings = new Map();
            transaction_or_id.AddEventListener('DateTimeChanged', this.OnTransactionChanged.bind(this));
            transaction_or_id.AddEventListener('DescriptionChanged', this.OnTransactionChanged.bind(this));
            transaction_or_id.AddEventListener('MoneyChanged', this.OnTransactionChanged.bind(this));
            transaction_or_id.AddEventListener('NameChanged', this.OnTransactionChanged.bind(this));
        }
    }

    public Bind(property: 'DateTime', on_set: BindingFunction<Date>): void;
    public Bind(property: 'Description', on_set: BindingFunction<string>): void;
    public Bind(property: 'Name', on_set: BindingFunction<string>): void;
    public Bind(property: 'Price', on_set: BindingFunction<bigint>): void;
    public Bind<T>(property: never, on_set: BindingFunction<T>): void {
        on_set(this[property]);

        if(!this.Bindings.has(property)) {
            this.Bindings.set(property, []);
        }
        let handlers = this.Bindings.get(property);
        handlers?.push(on_set);
    }

    protected OnTransactionChanged(t: Transaction, data: TransactionEventData) {
        switch(data.EventName) {
            case 'DateTimeChanged':
                this.DateTime = t.DateTime;
                this.ResolveBindings('DateTime');
                break;
            case 'DescriptionChanged':
                this.Description = t.Description;
                this.ResolveBindings('Description');
                break;
            case 'MoneyChanged':
                this.Price = t.Price;
                this.ResolveBindings('Price');
                break;
            case 'NameChanged':
                this.Name = t.Name;
                this.ResolveBindings('Name');
                break;
        }
    }

    protected ResolveBindings(property: TransactionDtoProperty) {
        let handlers = this.Bindings.get(property) ?? [];
        for(let handler of handlers) {
            handler(this[property]);
        }
    }
}
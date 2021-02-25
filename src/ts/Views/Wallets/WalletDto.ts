import Wallet, { WalletEventData } from '../../Model/Wallet';

type WalletDtoProperty = 'Balance' | 'Name';
type BindingFunction<T> = (value: T) => void;

export default class WalletDto {
    public readonly Id: bigint | undefined;
    public Name: string;
    public Balance: bigint;
    public IsDefault: boolean;

    protected Bindings: Map<WalletDtoProperty, BindingFunction<any>[]>;

    public constructor(wallet: Wallet);
    public constructor(id: bigint | undefined, name: string, balance: bigint, is_default: boolean);
    public constructor(wallet_or_id: Wallet | bigint | undefined, name?: string, balance?: bigint, is_default?: boolean) {
        if(typeof wallet_or_id == 'bigint' || wallet_or_id === undefined) {
            this.Id = wallet_or_id;
            this.Name = name!;
            this.Balance = balance!;
            this.IsDefault = is_default!;
        } else {
            this.Id = wallet_or_id.Id;
            this.Name = wallet_or_id.Name;
            this.Balance = wallet_or_id.Balance;
            this.IsDefault = wallet_or_id.Balance > 0;

            wallet_or_id.AddEventListener('BalanceChanged', this.OnWalletChanged.bind(this));
            wallet_or_id.AddEventListener('NameChanged', this.OnWalletChanged.bind(this));
        }
        this.Bindings = new Map();
    }

    public Bind(property: 'Balance', on_set: BindingFunction<bigint>): void;
    public Bind(property: 'Name', on_set: BindingFunction<string>): void;
    public Bind<T>(property: never, on_set: BindingFunction<T>): void {
        on_set(this[property]);

        if(!this.Bindings.has(property)) {
            this.Bindings.set(property, []);
        }
        let handlers = this.Bindings.get(property);
        handlers?.push(on_set);
    }

    protected OnWalletChanged(w: Wallet, data: WalletEventData) {
        switch(data.EventName) {
            case 'BalanceChanged':
                this.Balance = w.Balance;
                this.ResolveBindings('Balance');
                break;
            case 'NameChanged':
                this.Name = w.Name;
                this.ResolveBindings('Name');
                break;
        }
    }

    protected ResolveBindings(property: WalletDtoProperty) {
        let handlers = this.Bindings.get(property) ?? [];
        for(let handler of handlers) {
            handler(this[property]);
        }
    }
}
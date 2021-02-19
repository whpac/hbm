import Wallet, { WalletEventData } from '../../Model/Wallet';

type WalletDtoProperty = 'Balance' | 'Name';
type BindingFunction<T> = (value: T) => void;

export default class WalletDto {
    public readonly Id: bigint;
    public Name: string;
    public Balance: bigint;
    public IsDefault: boolean;

    protected Bindings: Map<WalletDtoProperty, BindingFunction<any>[]>;

    public constructor(wallet: Wallet) {
        this.Id = wallet.Id;
        this.Name = wallet.Name;
        this.Balance = wallet.Balance;
        this.IsDefault = wallet.Balance > 0;

        this.Bindings = new Map();
        wallet.AddEventListener('BalanceChanged', this.OnWalletChanged.bind(this));
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
        }
    }

    protected ResolveBindings(property: WalletDtoProperty) {
        let handlers = this.Bindings.get(property) ?? [];
        for(let handler of handlers) {
            handler(this[property]);
        }
    }
}
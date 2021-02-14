import Component from '../../Common/Component';
import { ComponentState } from '../../Common/ComponentState';
import WalletDto from '../WalletDto';

export default class WalletListItem<TEvent extends string = ""> extends Component<TEvent | 'Click'> {
    public readonly Wallet: WalletDto;
    protected Button: HTMLButtonElement | undefined;
    protected _IsSelected: boolean;

    /** Whether the item is selected */
    public get IsSelected() {
        return this._IsSelected;
    }
    public set IsSelected(value: boolean) {
        this._IsSelected = value;
        if(value) this.Button?.classList.add('selected');
        else this.Button?.classList.remove('selected');
    }

    public constructor(wallet: WalletDto) {
        super();

        this.Wallet = wallet;
        this._IsSelected = false;
        this.SetState(ComponentState.READY);
    }

    protected Render(): HTMLElement {
        let li = document.createElement('li');
        li.classList.add('wallet-list-item');

        this.Button = document.createElement('button');
        this.Button.type = 'button';
        this.Button.addEventListener('click', this.OnButtonPressed.bind(this));
        li.appendChild(this.Button);

        let span_name = document.createElement('span');
        span_name.classList.add('name');
        span_name.textContent = this.Wallet.Name;
        this.Button.appendChild(span_name);

        let span_balance = document.createElement('span');
        span_balance.classList.add('balance');
        if(this.Wallet.Balance < 0) span_balance.classList.add('negative');
        span_balance.textContent = (Number(this.Wallet.Balance) / 100).toLocaleString(undefined, { style: 'currency', currency: 'EUR' });
        this.Button.appendChild(span_balance);

        if(this.Wallet.IsDefault) {
            let span_subtitle = document.createElement('span');
            span_subtitle.classList.add('subtitle');
            span_subtitle.textContent = 'Default wallet';
            this.Button.appendChild(span_subtitle);
        }

        return li;
    }

    protected OnButtonPressed() {
        this.FireEvent('Click');
    }
}
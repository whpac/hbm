import Wallet from '../../Model/Wallet';
import Component from '../Common/Component';
import { ComponentState } from '../Common/ComponentState';

export default class WalletListItem extends Component {
    protected Wallet: Wallet;

    public constructor(wallet: Wallet) {
        super();

        this.Wallet = wallet;
        this.SetState(ComponentState.READY);
    }

    protected Render(): HTMLElement {
        let li = document.createElement('li');
        li.classList.add('wallet-list-item');

        let span_name = document.createElement('span');
        span_name.classList.add('name');
        span_name.textContent = this.Wallet.Name;
        li.appendChild(span_name);

        let span_balance = document.createElement('span');
        span_balance.classList.add('balance');
        if(this.Wallet.Balance <= 0) span_balance.classList.add('negative');
        span_balance.textContent = (Number(this.Wallet.Balance) / 100).toLocaleString(undefined, { style: 'currency', currency: 'EUR' });
        li.appendChild(span_balance);

        let span_subtitle = document.createElement('span');
        span_subtitle.classList.add('subtitle');
        span_subtitle.textContent = 'Needs attention';
        li.appendChild(span_subtitle);

        return li;
    }
}
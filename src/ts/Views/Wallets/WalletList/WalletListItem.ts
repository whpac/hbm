import Currency from '../../../Utils/Currency';
import { ComponentState } from '../../Common/ComponentState';
import ListViewItem from '../../Common/ListViewItem';
import WalletDto from '../WalletDto';

export default class WalletListItem<TEvent extends string = ""> extends ListViewItem<TEvent> {
    public readonly Wallet: WalletDto;

    public constructor(wallet: WalletDto) {
        let children = [];
        let span_name = document.createElement('span');
        span_name.classList.add('name');
        span_name.textContent = wallet.Name;
        children.push(span_name);

        let span_balance = document.createElement('span');
        span_balance.classList.add('balance');
        if(wallet.Balance < 0) span_balance.classList.add('negative');
        span_balance.textContent = Currency.Format(wallet.Balance);
        children.push(span_balance);

        if(wallet.IsDefault) {
            let span_subtitle = document.createElement('span');
            span_subtitle.classList.add('subtitle');
            span_subtitle.textContent = 'Default wallet';
            children.push(span_subtitle);
        }

        super(children);
        this.Wallet = wallet;
        this.SetState(ComponentState.READY);
    }

    protected Render(): HTMLElement {
        let li = super.Render();
        li.classList.add('wallet-list-item');

        return li;
    }
}
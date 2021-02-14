import Component from '../../Common/Component';
import WalletDto from '../WalletDto';

export default class WalletTransactions extends Component {
    protected WalletName: Text;

    public constructor() {
        super();

        this.WalletName = document.createTextNode('[Wallet name]');
    }

    protected Render(): HTMLElement {
        let pane = document.createElement('div');
        pane.classList.add('content-pane');

        let pane_heading = document.createElement('h2');
        pane_heading.classList.add('pane-heading');
        pane_heading.appendChild(this.WalletName);
        pane.appendChild(pane_heading);

        return pane;
    }

    public DisplayWalletTransactions(wallet: WalletDto | undefined, transactions: never[]) {
        this.WalletName.textContent = wallet?.Name ?? 'No wallet selected';
    }
}
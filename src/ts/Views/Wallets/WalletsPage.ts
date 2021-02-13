import Wallet from '../../Model/Wallet';
import WalletListingController from '../../WalletListing/WalletListingController';
import Component from '../Common/Component';
import { ComponentState } from '../Common/ComponentState';
import Page from '../Presentation/Page';
import WalletList from './WalletList';
import WalletListItem from './WalletListItem';
import WalletTransactions from './WalletTransactions';

export default class WalletsPage extends Component implements Page {
    protected WalletListPane: WalletList;
    protected WalletTransactionsPane: WalletTransactions;

    public constructor() {
        super();

        this.WalletListPane = new WalletList();
        this.WalletTransactionsPane = new WalletTransactions();
    }

    Load(): void | Promise<void> { }
    Unload(): void | Promise<void> { }
    GetTitle(): string {
        return 'Test';
    }

    protected Render(): HTMLElement {
        let elem = document.createElement('main');
        elem.appendChild(this.WalletListPane.GetElement());
        elem.appendChild(this.WalletTransactionsPane.GetElement());
        return elem;
    }

    public PopulateWallets(wallets: Wallet[]) {
        for(let wallet of wallets) {
            let new_item = new WalletListItem(wallet);
            this.WalletListPane.AddItem(new_item);
        }

        this.SetState(ComponentState.READY);
    }
}
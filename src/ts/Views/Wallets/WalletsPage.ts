import Component from '../Common/Component';
import { ComponentState } from '../Common/ComponentState';
import Page from '../Presentation/Page';
import WalletDto from './WalletDto';
import WalletList from './WalletList/WalletList';
import WalletListItem from './WalletList/WalletListItem';
import WalletTransactions from './Transactions/WalletTransactions';
import TransactionDto from './TransactionDto';
import LoadingWrapper from '../Common/LoadingWrapper';
import LoadingCircle from '../Common/LoadingCircle';

export default class WalletsPage extends Component<'WalletSelectionChanged'> implements Page {
    protected WalletListPane: WalletList;
    protected WalletTransactionsPane: WalletTransactions;

    public constructor() {
        super();

        this.WalletTransactionsPane = new WalletTransactions();
        this.WalletTransactionsPane.DisplayLoadingIndicator();
        this.WalletListPane = new WalletList();
        this.WalletListPane.AddEventListener('SelectionChanged', this.OnWalletSelectionChanged.bind(this));
    }

    Load(): void | Promise<void> { }
    Unload(): void | Promise<void> { }
    GetTitle(): string {
        return 'Test';
    }

    protected Render(): HTMLElement {
        let elem = document.createElement('main');
        elem.appendChild(this.WalletListPane.GetElement());

        let loading_wrapper = new LoadingWrapper(this.WalletTransactionsPane, new LoadingCircle(), 'wallet-transactions');

        elem.appendChild(loading_wrapper.GetElement());
        return elem;
    }

    public PopulateWallets(wallets: WalletDto[]) {
        for(let wallet of wallets) {
            let new_item = new WalletListItem(wallet);
            this.WalletListPane.AddItem(new_item);
        }

        this.WalletListPane.SetSelectedIndex(0);
        this.SetState(ComponentState.READY);
    }

    public GetSelectedWallet(): WalletDto | undefined {
        return this.WalletListPane.GetSelectedItem()?.Wallet;
    }

    public StartedFetchingTransactions() {
        this.WalletTransactionsPane.DisplayLoadingIndicator();
    }

    public DisplayWalletTransactions(wallet: WalletDto | undefined, transactions: TransactionDto[]) {
        this.WalletTransactionsPane.DisplayWalletTransactions(wallet, transactions);
    }

    protected OnWalletSelectionChanged() {
        this.FireEvent('WalletSelectionChanged');
    }
}
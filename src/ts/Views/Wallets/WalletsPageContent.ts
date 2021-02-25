import Component from '../Common/Component';
import { ComponentState } from '../Common/ComponentState';
import Page from '../Presentation/Page';
import WalletDto from './WalletDto';
import WalletListPane from './WalletList/WalletListPane';
import WalletTransactions from './Transactions/WalletTransactions';
import TransactionDto from './TransactionDto';
import StateWrapper from '../Common/StateWrapper';
import LoadingCircle from '../Common/LoadingCircle';
import ErrorPresenter from '../Common/ErrorPresenter';
import PageComponent from '../Presentation/PageComponent';

type WalletsPageEvents = WalletTransactionsEvents | 'AddWalletRequested' | 'WalletSelectionChanged';
type WalletTransactionsEvents =
    'AddTransactionRequested' | 'EditTransactionRequested' | 'RemoveTransactionRequested' |
    'EditWalletRequested' | 'RemoveWalletRequested';

export default class WalletsPageContent extends PageComponent<WalletsPageEvents> {
    protected WalletListPane: WalletListPane;
    protected WalletTransactionsPane: WalletTransactions;

    public constructor() {
        super();

        this.WalletTransactionsPane = new WalletTransactions();
        this.WalletTransactionsPane.DisplayLoadingIndicator();

        let events_to_forward: WalletTransactionsEvents[] = [
            'AddTransactionRequested', 'EditTransactionRequested', 'RemoveTransactionRequested',
            'EditWalletRequested', 'RemoveWalletRequested'
        ];
        for(let e of events_to_forward) {
            this.WalletTransactionsPane.AddEventListener(e, (() => this.FireEvent(e)).bind(this));
        }

        this.WalletListPane = new WalletListPane();
        this.WalletListPane.AddEventListener('SelectionChanged', this.OnWalletSelectionChanged.bind(this));
        this.WalletListPane.AddEventListener('AddWalletRequested', (() => this.FireEvent('AddWalletRequested')).bind(this));
    }

    Load(): void | Promise<void> { }
    Unload(): void | Promise<void> { }
    GetTitle(): string {
        return 'Your wallets';
    }

    protected Render(): HTMLElement {
        let elem = document.createElement('main');
        elem.appendChild(this.WalletListPane.GetElement());

        let loading_wrapper = new StateWrapper(this.WalletTransactionsPane, 'wallet-transactions');
        loading_wrapper.SetStatePresenter(ComponentState.LOADING, new LoadingCircle());
        loading_wrapper.SetStatePresenter(ComponentState.ERROR, new ErrorPresenter());

        elem.appendChild(loading_wrapper.GetElement());
        return elem;
    }

    public DisplayWalletListError(error_message: string) {
        this.SetState(ComponentState.ERROR, error_message);
    }

    public DisplayTransactionListError(error_message: string) {
        this.WalletTransactionsPane.DisplayLoadingError(error_message);
    }

    public PopulateWallets(wallets: WalletDto[]) {
        this.WalletListPane.PopulateWallets(wallets);
        this.SetState(ComponentState.READY);
    }

    public GetSelectedWallet(): WalletDto | undefined {
        return this.WalletListPane.GetSelectedItem()?.Wallet;
    }

    public SelectWallet(wallet: WalletDto) {
        this.WalletListPane.SelectWallet(wallet);
    }

    public StartedFetchingTransactions() {
        this.WalletTransactionsPane.DisplayLoadingIndicator();
    }

    public DisplayWalletTransactions(wallet: WalletDto | undefined, transactions: TransactionDto[]) {
        this.WalletTransactionsPane.DisplayWalletTransactions(wallet, transactions);
    }

    public GetSelectedTransaction(): TransactionDto | undefined {
        return this.WalletTransactionsPane.GetSelectedTransaction();
    }

    protected OnWalletSelectionChanged() {
        this.FireEvent('WalletSelectionChanged');
    }
}
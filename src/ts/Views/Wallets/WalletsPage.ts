import { ComponentState } from '../Common/ComponentState';
import ErrorPresenter from '../Common/ErrorPresenter';
import StateWrapper from '../Common/StateWrapper';
import PageComponent from '../Presentation/PageComponent';
import TransactionDto from './TransactionDto';
import WalletDto from './WalletDto';
import WalletsPageContent from './WalletsPageContent';

type WalletsPageEvents = 'AddWalletRequested' | 'WalletSelectionChanged' |
    'AddTransactionRequested' | 'EditTransactionRequested' | 'RemoveTransactionRequested' |
    'EditWalletRequested' | 'RemoveWalletRequested';

export default class WalletsPage extends PageComponent<WalletsPageEvents> {
    protected readonly PageContent: WalletsPageContent;
    protected readonly PageWrapper: StateWrapper;

    public constructor() {
        super();

        this.PageContent = new WalletsPageContent();
        this.PageWrapper = new StateWrapper(this.PageContent);
        this.PageWrapper.SetStatePresenter(ComponentState.ERROR, new ErrorPresenter());

        let events_to_forward: WalletsPageEvents[] = [
            'AddWalletRequested', 'WalletSelectionChanged',
            'AddTransactionRequested', 'EditTransactionRequested', 'RemoveTransactionRequested',
            'EditWalletRequested', 'RemoveWalletRequested'
        ];
        for(let e of events_to_forward) {
            this.PageContent.AddEventListener(e, (() => this.FireEvent(e)).bind(this));
        }
    }

    public Load(): void | Promise<void> { }
    public Unload(): void | Promise<void> { }
    public GetTitle(): string {
        return 'Your wallets';
    }

    protected Render(): HTMLElement {
        let elem = document.createElement('main');
        elem.appendChild(this.PageWrapper.GetElement());
        return elem;
    }

    public DisplayWalletListError(error_message: string) {
        this.PageContent.DisplayWalletListError(error_message);
    }

    public DisplayTransactionListError(error_message: string) {
        this.PageContent.DisplayTransactionListError(error_message);
    }

    public PopulateWallets(wallets: WalletDto[]) {
        this.PageContent.PopulateWallets(wallets);
    }

    public GetSelectedWallet(): WalletDto | undefined {
        return this.PageContent.GetSelectedWallet();
    }

    public SelectWallet(wallet: WalletDto) {
        this.PageContent.SelectWallet(wallet);
    }

    public StartedFetchingTransactions() {
        this.PageContent.StartedFetchingTransactions();
    }

    public DisplayWalletTransactions(wallet: WalletDto | undefined, transactions: TransactionDto[]) {
        this.PageContent.DisplayWalletTransactions(wallet, transactions);
    }

    public GetSelectedTransaction(): TransactionDto | undefined {
        return this.PageContent.GetSelectedTransaction();
    }
}
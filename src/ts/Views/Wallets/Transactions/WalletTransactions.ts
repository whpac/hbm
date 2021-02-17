import Component from '../../Common/Component';
import { ComponentState } from '../../Common/ComponentState';
import ListView from '../../Common/ListView';
import TransactionDto from '../TransactionDto';
import WalletDto from '../WalletDto';
import TransactionRow from './TransactionRow';
import WalletName from './WalletName';
import WalletOperations from './WalletOperations';

export default class WalletTransactions extends Component {
    protected WalletName: WalletName;
    protected WalletOperations: WalletOperations;
    protected TransactionsTable: ListView<TransactionRow>;

    public constructor() {
        super();

        this.WalletName = new WalletName('[Wallet name]');
        this.WalletOperations = new WalletOperations();
        this.TransactionsTable = new ListView();

        this.TransactionsTable.AddEventListener('SelectionChanged', this.OnTransactionSelectionChange.bind(this));
    }

    protected Render(): HTMLElement {
        let pane = document.createElement('div');
        pane.classList.add('content-pane');

        pane.appendChild(this.WalletName.GetElement());
        pane.appendChild(this.WalletOperations.GetElement());
        pane.appendChild(this.TransactionsTable.GetElement());

        return pane;
    }

    public DisplayWalletTransactions(wallet: WalletDto | undefined, transactions: TransactionDto[]) {
        this.WalletName.Text = wallet?.Name ?? 'No wallet selected';
        this.WalletName.Balance = wallet?.Balance;

        this.TransactionsTable.RemoveAllItems();
        for(let transaction of transactions) {
            let item = new TransactionRow(transaction);
            this.TransactionsTable.AddItem(item);
        }
        this.SetState(ComponentState.READY);
    }

    public DisplayLoadingIndicator() {
        this.SetState(ComponentState.LOADING);
    }

    public GetSelectedTransaction(): TransactionDto | undefined {
        return this.TransactionsTable.GetSelectedItem()?.Transaction;
    }

    protected OnTransactionSelectionChange() {
        this.WalletOperations.SetIsAnyTransactionSelected(this.TransactionsTable.GetSelectedItem() !== undefined);
    }
}
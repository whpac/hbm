import Component from '../../Common/Component';
import TransactionDto from '../TransactionDto';
import WalletDto from '../WalletDto';
import TransactionsTable from './TransactionsTable';
import WalletName from './WalletName';
import WalletOperations from './WalletOperations';

export default class WalletTransactions extends Component {
    protected WalletName: WalletName;
    protected TransactionsTable: TransactionsTable;

    public constructor() {
        super();

        this.WalletName = new WalletName('[Wallet name]');
        this.TransactionsTable = new TransactionsTable();
    }

    protected Render(): HTMLElement {
        let pane = document.createElement('div');
        pane.classList.add('content-pane');

        pane.appendChild(this.WalletName.GetElement());

        let menu_strip = new WalletOperations();
        pane.appendChild(menu_strip.GetElement());

        pane.appendChild(this.TransactionsTable.GetElement());

        return pane;
    }

    public DisplayWalletTransactions(wallet: WalletDto | undefined, transactions: TransactionDto[]) {
        this.WalletName.Text = wallet?.Name ?? 'No wallet selected';
        this.WalletName.Balance = wallet?.Balance;

        this.TransactionsTable.Purge();
        for(let transaction of transactions) {
            this.TransactionsTable.AddRow(transaction);
        }
    }
}
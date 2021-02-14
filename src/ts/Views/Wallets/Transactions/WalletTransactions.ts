import Component from '../../Common/Component';
import ListView from '../../Common/ListView';
import TransactionDto from '../TransactionDto';
import WalletDto from '../WalletDto';
import TransactionRow from './TransactionRow';
import WalletName from './WalletName';
import WalletOperations from './WalletOperations';

export default class WalletTransactions extends Component {
    protected WalletName: WalletName;
    protected TransactionsTable: ListView<TransactionRow>;

    public constructor() {
        super();

        this.WalletName = new WalletName('[Wallet name]');
        this.TransactionsTable = new ListView();
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

        this.TransactionsTable.RemoveAllItems();
        for(let transaction of transactions) {
            let item = new TransactionRow(transaction);
            this.TransactionsTable.AddItem(item);
        }
    }
}
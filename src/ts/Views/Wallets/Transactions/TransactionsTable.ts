import Currency from '../../../Utils/Currency';
import Component from '../../Common/Component';
import TransactionDto from '../TransactionDto';
import TransactionRow from './TransactionRow';

export default class TransactionsTable extends Component {
    protected DataTable: HTMLElement;
    protected DataTableBody: HTMLElement;

    public constructor() {
        super();

        this.DataTable = document.createElement('div');
        this.DataTableBody = document.createElement('div');
        this.DataTable.appendChild(this.DataTableBody);
    }

    protected Render(): HTMLElement {
        return this.DataTable;
    }

    public AddRow(transaction: TransactionDto) {
        let row = new TransactionRow(transaction);
        this.DataTableBody.appendChild(row.GetElement());
    }

    public Purge() {
        while(this.DataTableBody.firstChild !== null) {
            this.DataTableBody.removeChild(this.DataTableBody.lastChild!);
        }
    }
}
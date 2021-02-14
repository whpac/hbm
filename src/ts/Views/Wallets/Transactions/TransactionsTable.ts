import Currency from '../../../Utils/Currency';
import Component from '../../Common/Component';
import TransactionDto from '../TransactionDto';

export default class TransactionsTable extends Component {
    protected DataTable: HTMLTableElement;

    public constructor() {
        super();

        this.DataTable = document.createElement('table');

        let thead = this.DataTable.createTHead();
        let tr = thead.insertRow();
        let headings = ['Name', 'Price'];

        for(let heading of headings) {
            let th = document.createElement('th');
            th.textContent = heading;
            tr.appendChild(th);
        }
    }

    protected Render(): HTMLElement {
        return this.DataTable;
    }

    public AddRow(row: TransactionDto) {
        let tr = this.DataTable.insertRow();

        tr.insertCell().textContent = row.Name;
        tr.insertCell().textContent = Currency.Format(row.Price);
    }

    public Purge() {
        for(let tbody of this.DataTable.tBodies) {
            while(tbody.firstChild !== null) {
                tbody.removeChild(tbody.lastChild!);
            }
        }
    }
}
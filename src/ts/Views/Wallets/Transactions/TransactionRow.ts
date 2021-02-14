import Currency from '../../../Utils/Currency';
import Component from '../../Common/Component';
import TransactionDto from '../TransactionDto';

export default class TransactionRow extends Component {
    protected TransactionName: HTMLElement;
    protected TransactionDate: HTMLElement;
    protected MoneyAmount: HTMLElement;
    protected TransactionDescription: HTMLElement;
    protected TransactionType: HTMLElement;

    public constructor(transaction: TransactionDto) {
        super();

        this.TransactionName = document.createElement('span');
        this.TransactionName.classList.add('name');
        this.TransactionName.textContent = transaction.Name;

        this.TransactionType = document.createElement('span');
        this.TransactionType.classList.add('type');
        this.TransactionType.textContent = 'Salary';

        this.TransactionDate = document.createElement('span');
        this.TransactionDate.classList.add('date');
        this.TransactionDate.textContent = transaction.DateTime.toLocaleString();

        this.MoneyAmount = document.createElement('span');
        this.MoneyAmount.classList.add('money');
        this.MoneyAmount.textContent = Currency.Format(transaction.Price);

        this.TransactionDescription = document.createElement('div');
        this.TransactionDescription.classList.add('description');
        this.TransactionDescription.textContent = transaction.Description;
    }

    protected Render(): HTMLElement {
        let wrapper = document.createElement('div');
        wrapper.classList.add('transaction-row');

        let dot = document.createElement('span');
        dot.classList.add('dot');
        dot.textContent = '∙';

        wrapper.appendChild(this.TransactionName);
        wrapper.appendChild(dot);
        wrapper.appendChild(this.TransactionType);
        wrapper.appendChild(this.TransactionDate);
        wrapper.appendChild(this.MoneyAmount);
        wrapper.appendChild(this.TransactionDescription);

        return wrapper;
    }
}
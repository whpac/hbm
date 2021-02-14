import Currency from '../../../Utils/Currency';
import ListViewItem from '../../Common/ListViewItem';
import TransactionDto from '../TransactionDto';

export default class TransactionRow extends ListViewItem {
    protected TransactionName: HTMLElement;
    protected TransactionDate: HTMLElement;
    protected MoneyAmount: HTMLElement;
    protected TransactionDescription: HTMLElement;
    protected TransactionType: HTMLElement;

    public constructor(transaction: TransactionDto) {
        let name = document.createElement('span');
        name.classList.add('name');
        name.textContent = transaction.Name;

        let dot = document.createElement('span');
        dot.classList.add('dot');
        dot.textContent = '∙';

        let type = document.createElement('span');
        type.classList.add('type');
        type.textContent = transaction.CategoryName;
        type.title = transaction.CategoryDescription;

        let date = document.createElement('span');
        date.classList.add('date');
        date.textContent = transaction.DateTime.toLocaleString();

        if(transaction.Price > 0 && transaction.IsExpense == true) transaction.Price *= BigInt(-1);
        if(transaction.Price < 0 && transaction.IsExpense == false) transaction.Price *= BigInt(-1);

        let money = document.createElement('span');
        money.classList.add('money');
        money.textContent = Currency.Format(transaction.Price);

        let desc = document.createElement('div');
        desc.classList.add('description');
        desc.textContent = transaction.Description;

        super([name, dot, type, date, money, desc]);

        this.TransactionName = name;
        this.TransactionType = type;
        this.TransactionDate = date;
        this.MoneyAmount = money;
        this.TransactionDescription = desc;
    }

    protected Render(): HTMLElement {
        let li = super.Render();
        li.classList.add('transaction-row');
        return li;

        let wrapper = document.createElement('div');
        wrapper.classList.add('transaction-row');

        wrapper.appendChild(this.TransactionName);
        //wrapper.appendChild(dot);
        wrapper.appendChild(this.TransactionType);
        wrapper.appendChild(this.TransactionDate);
        wrapper.appendChild(this.MoneyAmount);
        wrapper.appendChild(this.TransactionDescription);

        return wrapper;
    }
}
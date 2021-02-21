import Currency from '../../../Utils/Currency';
import DateTime from '../../../Utils/DateTime';
import ListViewItem from '../../Common/ListViewItem';
import TransactionDto from '../TransactionDto';

export default class TransactionRow extends ListViewItem {
    public readonly Transaction: TransactionDto;
    protected TransactionName: HTMLElement;
    protected TransactionDate: HTMLElement;
    protected MoneyAmount: HTMLElement;
    protected TransactionDescription: HTMLElement;
    protected TransactionType: HTMLElement;

    public constructor(transaction: TransactionDto) {
        let name = document.createElement('span');
        name.classList.add('name');
        transaction.Bind('Name', (n) => name.textContent = n);

        let dot = document.createElement('span');
        dot.classList.add('dot');
        dot.textContent = '∙';

        let type = document.createElement('span');
        type.classList.add('type');
        type.textContent = transaction.CategoryName;
        type.title = transaction.CategoryDescription;

        let date = document.createElement('span');
        date.classList.add('date');
        transaction.Bind('DateTime', (date_time) => date.textContent = DateTime.ToStandardString(date_time));

        if(transaction.Price > 0 && transaction.IsExpense == true) transaction.Price *= BigInt(-1);
        if(transaction.Price < 0 && transaction.IsExpense == false) transaction.Price *= BigInt(-1);

        let money = document.createElement('span');
        money.classList.add('money');
        transaction.Bind('Price', (price) => money.textContent = Currency.Format(price));

        let desc = document.createElement('div');
        desc.classList.add('description');
        transaction.Bind('Description', (description) => {
            if(description != '') {
                desc.classList.remove('empty');
                desc.textContent = description;
            } else {
                desc.classList.add('empty');
                desc.textContent = 'No description provided.';
            }
        });

        super([name, dot, type, date, money, desc]);

        this.Transaction = transaction;
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
    }
}
import TransactionCategory from '../../../Model/TransactionCategory';
import { TransactionType } from '../../../Model/TransactionType';
import DateTime from '../../../Utils/Date';
import Dialog from '../../Common/Dialog/Dialog';
import DialogButton from '../../Common/Dialog/DialogButton';
import TransactionDto from '../TransactionDto';

export default class EditTransactionDialog extends Dialog<'SaveRequested'> {
    protected TransactionId: bigint | undefined;
    protected NameInput: HTMLInputElement;
    protected DescriptionInput: HTMLTextAreaElement;
    protected MoneyInput: HTMLInputElement;
    protected DateInput: HTMLInputElement;

    public constructor() {
        super();

        let grid_form = document.createElement('div');
        grid_form.classList.add('grid-form');
        this.AddContent(grid_form);

        let name_label = document.createElement('label');
        name_label.textContent = 'Transaction name:';
        this.NameInput = document.createElement('input');
        this.NameInput.type = 'text';
        this.NameInput.name = 'transaction-name';
        name_label.htmlFor = this.NameInput.id = 'field-transaction-name';
        grid_form.appendChild(name_label);
        grid_form.appendChild(this.NameInput);

        let desc_label = document.createElement('label');
        desc_label.textContent = 'An additional description:';
        desc_label.classList.add('whole-row');
        this.DescriptionInput = document.createElement('textarea');
        this.DescriptionInput.name = 'transaction-description';
        this.DescriptionInput.classList.add('whole-row');
        desc_label.htmlFor = this.DescriptionInput.id = 'field-transaction-description';
        grid_form.appendChild(desc_label);
        grid_form.appendChild(this.DescriptionInput);

        let money_label = document.createElement('label');
        money_label.textContent = 'Money transferred:';
        this.MoneyInput = document.createElement('input');
        this.MoneyInput.type = 'number';
        this.MoneyInput.step = '0.01';
        this.MoneyInput.min = '0';
        this.MoneyInput.name = 'transaction-money';
        money_label.htmlFor = this.MoneyInput.id = 'field-transaction-money';
        grid_form.appendChild(money_label);
        grid_form.appendChild(this.MoneyInput);

        let date_label = document.createElement('label');
        date_label.textContent = 'Transaction date:';
        this.DateInput = document.createElement('input');
        this.DateInput.type = 'datetime-local';
        this.DateInput.name = 'transaction-date';
        date_label.htmlFor = this.DateInput.id = 'field-transaction-date';
        grid_form.appendChild(date_label);
        grid_form.appendChild(this.DateInput);

        let discard_button = new DialogButton('Discard');
        discard_button.AddEventListener('Click', this.Hide.bind(this));
        this.AddButton(discard_button);

        let save_button = new DialogButton('Save', true);
        save_button.AddEventListener('Click', this.OnSaveRequested.bind(this));
        this.AddButton(save_button);
    }

    public Populate(transaction: TransactionDto | undefined) {
        this.TransactionId = transaction?.Id;
        this.NameInput.value = transaction?.Name ?? '';
        this.DescriptionInput.value = transaction?.Description ?? '';

        if(transaction !== undefined) {
            this.MoneyInput.value = (Number(transaction.Price) / 100).toString();
            this.DateInput.value = DateTime.ToInputFormat(transaction.DateTime);
            this.SetTitle('Edit transaction');
        } else {
            this.MoneyInput.value = '0';
            this.DateInput.value = DateTime.ToInputFormat(new Date());
            this.SetTitle('New transaction');
        }

    }

    protected OnSaveRequested() {
        if(!this.Validate()) return;
        this.FireEvent('SaveRequested', new TransactionDto(
            this.TransactionId,
            this.NameInput.value,
            this.DescriptionInput.value,
            BigInt(Number(this.MoneyInput.value) * 100),
            new Date(this.DateInput.value),
            new TransactionCategory(BigInt(2), '(null)', '(null)', TransactionType.REVENUES)
        ));
    }

    protected Validate() {
        let is_valid = true;

        if(this.NameInput.value.trim().length == 0) {
            this.NameInput.setCustomValidity('The transaction name must not be empty');
        } else {
            this.NameInput.setCustomValidity('');
        }
        is_valid &&= this.NameInput.reportValidity();
        is_valid &&= this.DescriptionInput.reportValidity();
        is_valid &&= this.MoneyInput.reportValidity();

        if(this.DateInput.value.trim().length == 0 || isNaN(Date.parse(this.DateInput.value))) {
            this.DateInput.setCustomValidity('The transaction date field must contain a correct date');
        } else {
            this.DateInput.setCustomValidity('');
        }
        is_valid &&= this.DateInput.reportValidity();

        return is_valid;
    }
}
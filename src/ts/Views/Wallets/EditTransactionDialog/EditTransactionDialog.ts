import Dialog from '../../Common/Dialog/Dialog';
import DialogButton from '../../Common/Dialog/DialogButton';

export default class EditTransactionDialog extends Dialog {
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

        this.SetTitle('Edit transaction');
        this.AddButton(new DialogButton('Discard'));
        this.AddButton(new DialogButton('Save', true));
    }
}
import Dialog from '../../Common/Dialog/Dialog';
import DialogButton from '../../Common/Dialog/DialogButton';
import WalletDto from '../WalletDto';

export default class AddWalletDialog extends Dialog<'SaveRequested'> {
    protected WalletNameInput: HTMLInputElement;
    protected WalletBalanceInput: HTMLInputElement;
    protected DiscardButton: DialogButton;
    protected SaveButton: DialogButton;
    protected ErrorText: HTMLElement;

    public constructor() {
        super();

        this.SetTitle('Create a wallet');

        let form = document.createElement('div');
        form.classList.add('grid-form');
        this.AddContent(form);

        let name_label = document.createElement('label');
        name_label.textContent = 'The new wallet name:';
        form.appendChild(name_label);

        this.WalletNameInput = document.createElement('input');
        this.WalletNameInput.id = name_label.htmlFor = 'field-wallet-name';
        this.WalletNameInput.name = 'wallet-name';
        this.WalletNameInput.type = 'text';
        form.appendChild(this.WalletNameInput);

        let balance_label = document.createElement('label');
        balance_label.textContent = 'Initial balance:';
        form.appendChild(balance_label);

        this.WalletBalanceInput = document.createElement('input');
        this.WalletBalanceInput.id = balance_label.htmlFor = 'field-wallet-balance';
        this.WalletBalanceInput.name = 'wallet-balance';
        this.WalletBalanceInput.type = 'number';
        this.WalletBalanceInput.step = '0.01';
        this.WalletBalanceInput.min = '';
        form.appendChild(this.WalletBalanceInput);

        this.ErrorText = document.createElement('div');
        this.ErrorText.classList.add('error');
        this.AddContent(this.ErrorText);

        this.DiscardButton = new DialogButton('Cancel');
        this.DiscardButton.AddEventListener('Click', this.Hide.bind(this));
        this.AddButton(this.DiscardButton);

        this.SaveButton = new DialogButton('Create', true);
        this.SaveButton.AddEventListener('Click', this.OnSaveRequested.bind(this));
        this.AddButton(this.SaveButton);
    }

    public Prepare() {
        this.WalletNameInput.value = '';
        this.WalletBalanceInput.value = '0';

        this.DiscardButton.Enabled = true;
        this.SaveButton.Enabled = true;
        this.IsCloseButtonEnabled = true;
        this.ErrorText.textContent = '';
    }

    /**
     * Re-enables the dialog buttons to indicate that the user has to do something
     */
    public OnSaveFailed(error_text: string) {
        this.DiscardButton.Enabled = true;
        this.SaveButton.Enabled = true;
        this.IsCloseButtonEnabled = true;
        this.ErrorText.textContent = error_text;
    }

    protected OnSaveRequested() {
        if(!this.Validate()) return;

        this.DiscardButton.Enabled = false;
        this.SaveButton.Enabled = false;
        this.IsCloseButtonEnabled = false;
        this.ErrorText.textContent = '';

        this.FireEvent('SaveRequested', new WalletDto(
            undefined,
            this.WalletNameInput.value,
            BigInt(Number(this.WalletBalanceInput.value) * 100),
            false
        ));
    }

    protected Validate() {
        let is_valid = true;

        if(this.WalletNameInput.value.trim().length == 0) {
            this.WalletNameInput.setCustomValidity('The wallet name must not be empty');
        } else {
            this.WalletNameInput.setCustomValidity('');
        }
        is_valid &&= this.WalletNameInput.reportValidity();
        is_valid &&= this.WalletBalanceInput.reportValidity();

        return is_valid;
    }
}
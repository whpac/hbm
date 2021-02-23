import Dialog from '../../Common/Dialog/Dialog';
import DialogButton from '../../Common/Dialog/DialogButton';
import WalletDto from '../WalletDto';

export default class EditWalletDialog extends Dialog<'SaveRequested'> {
    protected WalletNameNode: Text;
    protected WalletNameInput: HTMLInputElement;
    protected DiscardButton: DialogButton;
    protected SaveButton: DialogButton;
    protected ErrorText: HTMLElement;
    protected Wallet: WalletDto | undefined;

    public constructor() {
        super();

        this.SetTitle('Rename wallet');

        let form = document.createElement('div');
        form.classList.add('grid-form');
        this.AddContent(form);

        let prompt = document.createElement('label');
        prompt.classList.add('whole-row');
        prompt.textContent = 'Type here the new name for \'';
        prompt.appendChild(this.WalletNameNode = document.createTextNode(''));
        prompt.appendChild(document.createTextNode('\'.'));
        form.appendChild(prompt);

        this.WalletNameInput = document.createElement('input');
        this.WalletNameInput.classList.add('whole-row');
        this.WalletNameInput.id = prompt.htmlFor = 'field-new-wallet-name';
        this.WalletNameInput.name = 'new-wallet-name';
        form.appendChild(this.WalletNameInput);

        this.ErrorText = document.createElement('div');
        this.ErrorText.classList.add('error');
        this.AddContent(this.ErrorText);

        this.DiscardButton = new DialogButton('Cancel');
        this.DiscardButton.AddEventListener('Click', this.Hide.bind(this));
        this.AddButton(this.DiscardButton);

        this.SaveButton = new DialogButton('Save', true);
        this.SaveButton.AddEventListener('Click', this.OnSaveRequested.bind(this));
        this.AddButton(this.SaveButton);
    }

    public Populate(wallet: WalletDto) {
        this.WalletNameNode.textContent = wallet.Name;
        this.WalletNameInput.value = wallet.Name;
        this.Wallet = wallet;

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
        if(this.Wallet === undefined) return;
        if(!this.Validate()) return;

        this.DiscardButton.Enabled = false;
        this.SaveButton.Enabled = false;
        this.IsCloseButtonEnabled = false;
        this.ErrorText.textContent = '';

        this.FireEvent('SaveRequested', new WalletDto(
            this.Wallet.Id,
            this.WalletNameInput.value,
            this.Wallet.Balance,
            this.Wallet.IsDefault
        ));
    }

    protected Validate() {
        let is_valid = true;

        if(this.WalletNameInput.value.trim().length == 0) {
            this.WalletNameInput.setCustomValidity('The wallet new name must not be empty');
        } else {
            this.WalletNameInput.setCustomValidity('');
        }
        is_valid &&= this.WalletNameInput.reportValidity();

        return is_valid;
    }
}
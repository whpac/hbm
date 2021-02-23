import Dialog from '../../Common/Dialog/Dialog';
import DialogButton from '../../Common/Dialog/DialogButton';
import WalletDto from '../WalletDto';

export default class RemoveWalletDialog extends Dialog<'RemoveRequested'> {
    protected Wallet: WalletDto | undefined;
    protected WalletNameNode: Text;
    protected NoButton: DialogButton;
    protected YesButton: DialogButton;
    protected ErrorText: HTMLElement;

    public constructor() {
        super();

        this.SetTitle('Confirmation');
        this.IsCloseButtonVisible = false;

        let body = document.createElement('div');
        body.textContent = 'Are you sure you want to remove wallet \'';
        body.appendChild(this.WalletNameNode = document.createTextNode(''));
        body.appendChild(document.createTextNode('\'?'));
        this.AddContent(body);

        this.ErrorText = document.createElement('div');
        this.ErrorText.classList.add('error');
        this.AddContent(this.ErrorText);

        this.NoButton = new DialogButton('No, leave it');
        this.NoButton.AddEventListener('Click', this.Hide.bind(this));
        this.AddButton(this.NoButton);

        this.YesButton = new DialogButton('Yes, remove it', true);
        this.YesButton.AddEventListener('Click', this.OnRemoveRequested.bind(this));
        this.AddButton(this.YesButton);
    }

    public Populate(wallet: WalletDto) {
        this.WalletNameNode.textContent = wallet.Name;
        this.Wallet = wallet;

        this.YesButton.Enabled = true;
        this.NoButton.Enabled = true;
        this.ErrorText.textContent = '';
    }

    protected OnRemoveRequested() {
        this.YesButton.Enabled = false;
        this.NoButton.Enabled = false;
        this.ErrorText.textContent = '';

        this.FireEvent('RemoveRequested', this.Wallet);
    }

    /**
     * Re-enables the dialog buttons to indicate that the user has to do something
     */
    public OnRemoveFailed(error_text: string) {
        this.NoButton.Enabled = true;
        this.YesButton.Enabled = true;
        this.IsCloseButtonEnabled = true;
        this.ErrorText.textContent = error_text;
    }
}
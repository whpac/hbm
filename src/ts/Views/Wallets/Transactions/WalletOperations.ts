import MenuButton from '../../Common/MenuStrip/MenuButton';
import MenuSeparator from '../../Common/MenuStrip/MenuSeparator';
import MenuStrip from '../../Common/MenuStrip/MenuStrip';
import SubMenu from '../../Common/MenuStrip/SubMenu';

type WalletOperationsEvents = 'AddTransactionRequested' | 'EditTransactionRequested' |
    'RemoveTransactionRequested' | 'EditWalletRequested';

export default class WalletOperations extends MenuStrip<WalletOperationsEvents> {
    protected AddButton: MenuButton;
    protected EditButton: MenuButton;
    protected RemoveButton: MenuButton;
    protected FilterButton: MenuButton;
    protected EditWalletButton: MenuButton;
    protected RemoveWalletButton: MenuButton;
    protected DefaultWalletButton: MenuButton;

    public constructor() {
        super();

        this.AddMenuItem(this.AddButton = new MenuButton('Add', { ToolTip: 'Add a new transaction', IconName: 'add-outline' }));
        this.AddMenuItem(new MenuSeparator());
        this.AddMenuItem(this.EditButton = new MenuButton('Edit', { ToolTip: 'Edit the selected transaction', IconName: 'create-outline' }));
        this.AddMenuItem(this.RemoveButton = new MenuButton('Remove', { ToolTip: 'Remove the selected transaction', IconName: 'trash-outline' }));

        this.AddSecondaryMenuItem(this.FilterButton = new MenuButton('Filter', { ToolTip: 'Decide which transactions to display', IconName: 'filter-outline' }));
        this.AddSecondaryMenuItem(new MenuSeparator());

        let wallet_submenu = new SubMenu(new MenuButton('Wallet'));
        wallet_submenu.AddMenuItem(this.EditWalletButton = new MenuButton('Rename', { IconName: 'create-outline' }));
        wallet_submenu.AddMenuItem(this.RemoveWalletButton = new MenuButton('Remove', { IconName: 'trash-outline' }));
        wallet_submenu.AddMenuItem(new MenuSeparator());
        wallet_submenu.AddMenuItem(this.DefaultWalletButton = new MenuButton('Set as default'));
        this.AddSecondaryMenuItem(wallet_submenu);

        this.SetIsAnyTransactionSelected(false);

        this.AddButton.AddEventListener('Click', (() => this.FireEvent('AddTransactionRequested')).bind(this));
        this.EditButton.AddEventListener('Click', (() => this.FireEvent('EditTransactionRequested')).bind(this));
        this.RemoveButton.AddEventListener('Click', (() => this.FireEvent('RemoveTransactionRequested')).bind(this));

        this.FilterButton.Enabled = false;
        this.EditWalletButton.AddEventListener('Click', (() => this.FireEvent('EditWalletRequested')).bind(this));
        this.RemoveWalletButton.Enabled = false;
        this.DefaultWalletButton.Enabled = false;
    }

    /**
     * Sets if any transaction is selected. If so, the transaction options will be enabled
     * @param is_selected Whether any transaction is selected
     */
    public SetIsAnyTransactionSelected(is_selected: boolean) {
        this.EditButton.Enabled = is_selected;
        this.RemoveButton.Enabled = is_selected;
    }
}
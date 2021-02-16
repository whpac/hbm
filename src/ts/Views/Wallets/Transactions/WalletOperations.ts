import { DropdownDirection } from '../../Common/MenuStrip/DropdownDirection';
import MenuButton from '../../Common/MenuStrip/MenuButton';
import MenuSeparator from '../../Common/MenuStrip/MenuSeparator';
import MenuStrip from '../../Common/MenuStrip/MenuStrip';
import SubMenu from '../../Common/MenuStrip/SubMenu';

export default class WalletOperations extends MenuStrip {
    protected AddButton: MenuButton;
    protected EditButton: MenuButton;
    protected RemoveButton: MenuButton;

    public constructor() {
        super();

        this.AddMenuItem(this.AddButton = new MenuButton('Add', { ToolTip: 'Add a new transaction', IconName: 'add-outline' }));
        this.AddMenuItem(new MenuSeparator());
        this.AddMenuItem(this.EditButton = new MenuButton('Edit', { ToolTip: 'Edit the selected transaction', IconName: 'create-outline' }));
        this.AddMenuItem(this.RemoveButton = new MenuButton('Remove', { ToolTip: 'Remove the selected transaction', IconName: 'trash-outline' }));

        this.AddSecondaryMenuItem(new MenuButton('Filter', { ToolTip: 'Decide which transactions to display', IconName: 'filter-outline' }));
        this.AddSecondaryMenuItem(new MenuSeparator());

        let wallet_submenu = new SubMenu(new MenuButton('Wallet'));
        wallet_submenu.AddMenuItem(new MenuButton('Edit', { IconName: 'create-outline' }));
        wallet_submenu.AddMenuItem(new MenuButton('Remove', { IconName: 'trash-outline' }));
        wallet_submenu.AddMenuItem(new MenuSeparator());
        wallet_submenu.AddMenuItem(new MenuButton('Set as default'));
        this.AddSecondaryMenuItem(wallet_submenu);

        this.EditButton.Enabled = false;
        this.RemoveButton.Enabled = false;
    }
}
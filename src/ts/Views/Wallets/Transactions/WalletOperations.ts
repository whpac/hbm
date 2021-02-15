import MenuButton from '../../Common/MenuStrip/MenuButton';
import MenuStrip from '../../Common/MenuStrip/MenuStrip';

export default class WalletOperations extends MenuStrip {

    public constructor() {
        super();

        this.AddMenuItem(new MenuButton('Add', { ToolTip: 'Add a new transaction', IconName: 'add-outline' }));
        this.AddMenuItem(new MenuButton('Edit', { ToolTip: 'Edit the selected transaction', IconName: 'create-outline' }));
        this.AddMenuItem(new MenuButton('Remove', { ToolTip: 'Remove the selected transaction', IconName: 'trash-outline' }));

        this.AddSecondaryMenuItem(new MenuButton('Filter', { ToolTip: 'Decide which transactions to display', IconName: 'filter-outline' }));
        this.AddSecondaryMenuItem(new MenuButton('Wallet V'));
    }
}
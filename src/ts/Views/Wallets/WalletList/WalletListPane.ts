import Button from '../../Common/Button';
import Component from '../../Common/Component';
import ListView from '../../Common/ListView';
import LoadingCircle from '../../Common/LoadingCircle';
import LoadingWrapper from '../../Common/LoadingWrapper';
import WalletDto from '../WalletDto';
import WalletListItem from './WalletListItem';

export default class WalletListPane extends Component<'SelectionChanged' | 'AddWalletRequested'>{
    protected WalletsList: ListView<WalletListItem>;

    public constructor() {
        super();

        this.WalletsList = new ListView();
        this.WalletsList.AddEventListener('SelectionChanged', (() => this.FireEvent('SelectionChanged')).bind(this));
        this.WalletsList.IsWaitingForData = true;
    }

    protected Render(): HTMLElement {
        let pane = document.createElement('div');
        pane.classList.add('list-pane');

        let pane_heading = document.createElement('h2');
        pane_heading.classList.add('pane-heading');
        pane_heading.textContent = 'Wallets';
        pane.appendChild(pane_heading);

        let add_wallet_button = new Button('Add', { IconName: 'add-outline', ToolTip: 'Add a new wallet' });
        add_wallet_button.AddEventListener('Click', (() => this.FireEvent('AddWalletRequested')).bind(this));
        pane_heading.appendChild(add_wallet_button.GetElement());

        let loading_wrapper = new LoadingWrapper(this.WalletsList, new LoadingCircle());
        pane.appendChild(loading_wrapper.GetElement());

        return pane;
    }

    public PopulateWallets(wallets: WalletDto[]) {
        this.WalletsList.RemoveAllItems();
        for(let wallet of wallets) {
            let new_item = new WalletListItem(wallet);
            this.WalletsList.AddItem(new_item);
        }
        this.WalletsList.SetSelectedIndex(0);
        this.WalletsList.IsWaitingForData = false;
    }

    public GetSelectedItem() {
        return this.WalletsList.GetSelectedItem();
    }
}
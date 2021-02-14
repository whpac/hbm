import Component from '../../Common/Component';
import WalletListItem from './WalletListItem';

export default class WalletList extends Component<'SelectionChanged'> {
    protected ListElement: HTMLUListElement;
    protected Items: WalletListItem[];
    protected SelectedItem: WalletListItem | undefined;

    public constructor() {
        super();

        this.ListElement = document.createElement('ul');
        this.ListElement.classList.add('wallet-list');

        this.Items = [];
    }

    protected Render(): HTMLElement {
        let pane = document.createElement('div');
        pane.classList.add('list-pane');

        let pane_heading = document.createElement('h2');
        pane_heading.classList.add('pane-heading');
        pane_heading.textContent = 'Wallets';
        pane.appendChild(pane_heading);

        pane.appendChild(this.ListElement);

        return pane;
    }

    public AddItem(item: WalletListItem): void {
        this.Items.push(item);
        item.AddEventListener('Click', this.OnItemClicked.bind(this));
        this.ListElement.appendChild(item.GetElement());
    }

    public GetSelectedItem(): WalletListItem | undefined {
        return this.SelectedItem;
    }

    public SetSelectedIndex(index: number): void {
        if(this.SelectedItem !== undefined) {
            this.SelectedItem.IsSelected = false;
        }

        if(index < 0 || index >= this.Items.length) {
            this.SelectedItem = undefined;
        } else {
            this.SelectedItem = this.Items[index];
            this.SelectedItem.IsSelected = true;
        }

        this.FireEvent('SelectionChanged');
    }

    protected OnItemClicked(component: Component) {
        if(this.SelectedItem === component) return;
        if(this.SelectedItem !== undefined) {
            this.SelectedItem.IsSelected = false;
        }

        this.SelectedItem = component as WalletListItem;
        this.SelectedItem.IsSelected = true;

        this.FireEvent('SelectionChanged');
    }
}